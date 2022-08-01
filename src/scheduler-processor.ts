import { Bob } from 'alice-bob'
import { SyncedSet } from 'synced-set'

import { core } from './scheduler-core'
import { getEventsInRange } from './util'

import type { SchedulerEventGroup } from './scheduler-event'
import type { SchedulerNode } from './scheduler-node'

export class SchedulerProcessor extends AudioWorkletProcessor {
  blockSize = 128

  private sampleTime = 1 / sampleRate
  private quantumDurationTime = this.blockSize / sampleRate
  private bpm = 120

  coeff = 1
  playbackStartTime = 0
  adjustedStartTime = 0
  running = false

  eventGroups = new SyncedSet<SchedulerEventGroup, null>({
    send: (_, cb) => cb(),
    pick: core.pickFromLocal,
    reducer: () => null,
    equal: () => true,
  })

  constructor() {
    super()

    const [worklet] = new Bob<SchedulerProcessor, SchedulerNode>(
      data => this.port.postMessage({ rpc: data }),
      this
    ).agents({ debug: false })

    this.port.onmessage = ({ data }) => {
      if (data.rpc) worklet.receive(data.rpc)
      if (data.eventGroups) this.eventGroups.receive(core.deserialize(data.eventGroups))
    }
  }

  async start(playbackStartTime = currentTime) {
    this.running = true
    this.playbackStartTime = playbackStartTime
    this.adjustedStartTime = this.playbackStartTime * this.coeff
    return playbackStartTime
  }

  stop() {
    this.running = false
  }

  setBpm(bpm: number) {
    this.bpm = bpm

    this.coeff = 2 / ((60 * 4) / this.bpm)
    this.sampleTime = (1 / sampleRate) / this.coeff
    this.quantumDurationTime = (this.blockSize / sampleRate) * this.coeff

    const diff = currentTime - this.playbackStartTime
    this.adjustedStartTime = (currentTime - diff) * this.coeff
  }

  process() {
    if (!this.running) return true

    for (const eventGroup of this.eventGroups) {
      const events = getEventsInRange(
        eventGroup.events,
        eventGroup.loop,
        eventGroup.loopStart,
        eventGroup.loopEnd,
        // TODO: a better version requires an internal clock
        //  that adjusts its speed based on the currentFrame
        //  and "speeds up/down" from its current position,
        //  rather than shifting the entire clock up/down
        //  but this is good enough for now.
        //  That clock would have to be shared with the UI
        //  using a shared buffer element so the transport
        //  shows the right position (now uses currentTime
        //  and repeats the calculation).
        currentTime * this.coeff,
        this.sampleTime,
        this.quantumDurationTime,
        this.adjustedStartTime
      )
      for (const target of eventGroup.targets) {
        for (const [receivedTime, event] of events) {
          target.midiQueue.push(receivedTime / this.coeff, ...event.midiEvent.data)
        }
      }
    }
    return true
  }
}

registerProcessor('scheduler', SchedulerProcessor)

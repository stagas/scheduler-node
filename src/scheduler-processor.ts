import { Bob } from 'alice-bob'
import { SyncedSet } from 'synced-set'

import { core } from './scheduler-core'
import { getEventsInRange } from './util'

import type { SchedulerEventGroup } from './scheduler-event'
import type { SchedulerNode } from './scheduler-node'

let lastReceivedTime = currentTime

export class SchedulerProcessor extends AudioWorkletProcessor {
  blockSize = 128

  private sampleTime = 1 / sampleRate
  private quantumDurationTime = this.blockSize / sampleRate
  private bpm = 120

  coeff = 1
  playbackStartTime = 0
  adjustedStartTime = 0
  internalTime = 0
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
    this.internalTime = this.adjustedStartTime
    lastReceivedTime = playbackStartTime
    return this.playbackStartTime
  }

  stop() {
    this.running = false
  }

  async setBpm(bpm: number) {
    this.bpm = bpm

    this.coeff = 1 / ((60 * 4) / this.bpm)
    this.sampleTime = (1 / sampleRate) / this.coeff
    this.quantumDurationTime = (this.blockSize / sampleRate) * this.coeff

    return this.coeff
  }

  process() {
    if (!this.running) return true

    const now = currentTime
    const elapsedTime = now - lastReceivedTime
    lastReceivedTime = now

    this.internalTime += elapsedTime * this.coeff

    for (const eventGroup of this.eventGroups) {
      const events = getEventsInRange(
        eventGroup.events,
        eventGroup.loop,
        eventGroup.loopStart,
        eventGroup.loopEnd,
        this.internalTime,
        this.sampleTime,
        this.quantumDurationTime,
        this.adjustedStartTime
      )
      for (const target of eventGroup.targets) {
        for (const [receivedTime, event] of events) {
          target.midiQueue.push(receivedTime, ...event.midiEvent.data)
        }
      }
    }
    return true
  }
}

registerProcessor('scheduler', SchedulerProcessor)

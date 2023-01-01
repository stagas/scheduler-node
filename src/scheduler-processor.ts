import { Bob } from 'alice-bob'
import { SyncedSet } from 'synced-set'

import { core } from './scheduler-core'
import { getEventsInRange } from './util'

import type { SchedulerEvent, SchedulerEventGroup } from './scheduler-event'
import type { SchedulerNode, SchedulerSyncedSetPayload } from './scheduler-node'

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
  diffTime = 0
  running = false

  eventGroups = new SyncedSet<SchedulerEventGroup, SchedulerSyncedSetPayload>({
    send: (_, cb) => cb(),
    pick: core.pickFromLocal,
    reducer: eventGroup => ({
      targets: eventGroup.targets,
      events: eventGroup.events,
    }),
    equal: (prev, next) => (
      prev.targets === next.targets
      && !!prev.events && !!next.events
      && prev.events?.id === next.events?.id
    ),
  })

  queue = new Map<SchedulerEventGroup, Map<number, Set<SchedulerEvent>>>()

  node: SchedulerNode

  constructor() {
    super()

    const [worklet, node] = new Bob<SchedulerProcessor, SchedulerNode>(
      data => this.port.postMessage({ rpc: data }),
      this
    ).agents({ debug: false })

    this.node = node

    this.port.onmessage = ({ data }) => {
      if (data.rpc) worklet.receive(data.rpc)
      if (data.eventGroups) this.eventGroups.receive(core.deserialize(data.eventGroups))
    }

    this.eventGroups.on('add', (eventGroup) => {
      this.queue.set(eventGroup, eventGroup.events
        ? new Map([[eventGroup.events.turn, eventGroup.events.events]])
        : new Map()
      )
    })

    this.eventGroups.on('delete', (eventGroup) => {
      this.queue.delete(eventGroup)
    })

    this.eventGroups.on('update', (eventGroup, key) => {
      if (key === 'events') {
        const evs = eventGroup.events
        if (evs) {
          const queue = this.queue.get(eventGroup)!
          queue.set(evs.turn, evs.events)
          console.log('received', evs.turn)
          if (this.waitingEvents.has(eventGroup.id)) {
            this.waitingEvents.delete(eventGroup.id)
          } else {
            this.waitingEvents.add(eventGroup.id)
            this.node.requestNextEvents(eventGroup.id, evs.turn + 1)
          }
        }
      }
    })
  }

  async start(playbackStartTime = currentTime) {
    this.running = true
    this.diffTime = playbackStartTime - currentTime
    this.playbackStartTime = playbackStartTime //playbackStartTime
    this.adjustedStartTime = this.playbackStartTime * this.coeff
    this.internalTime = -this.diffTime //this.adjustedStartTime //- this.diffTime //- this.diffTime //- this.diffTime * this.coeff
    lastReceivedTime = currentTime

    for (const sets of this.queue.values()) {
      sets.forEach((evs) => {
        evs.forEach((ev) => {
          ev.playedAt = -1
        })
      })
    }

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

  waitingEvents = new Set<string>()

  process() {
    if (!this.running) return true

    const now = currentTime
    const elapsedTime = now - lastReceivedTime
    lastReceivedTime = now

    const prevInternalTime = this.internalTime
    this.internalTime += elapsedTime * this.coeff
    // console.log(this.internalTime)
    if (prevInternalTime < 0 && this.internalTime > 0) {
      this.internalTime = 0
      // this.adjustedStartTime = currentTime * this.coeff
    }

    const needNextEvents: SchedulerEventGroup[] = []
    for (const eventGroup of this.eventGroups) {
      const { needNext, results: events } = getEventsInRange(
        this.queue.get(eventGroup)!,
        eventGroup.loop,
        eventGroup.loopStart,
        eventGroup.loopEnd,
        this.internalTime,
        this.sampleTime,
        this.quantumDurationTime,
        this.adjustedStartTime,
      )

      for (const target of eventGroup.targets) {
        for (const [receivedTime, event] of events) {
          target.midiQueue.push(receivedTime, ...event.midiEvent.data)
        }
      }

      if (needNext && !this.waitingEvents.has(eventGroup.id)) {
        needNextEvents.push(eventGroup)
      }
    }

    if (needNextEvents.length) {
      for (const eventGroup of needNextEvents) {
        this.waitingEvents.add(eventGroup.id)
        this.node.requestNextEvents(
          eventGroup.id,
          (eventGroup.events?.turn ?? -1) + 1
        )
      }
    }

    return true
  }
}

registerProcessor('scheduler', SchedulerProcessor)

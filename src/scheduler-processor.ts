import { Bob } from 'alice-bob'
import { SyncedSet } from 'synced-set'

import { core } from './scheduler-core'
import { getEventsInRange } from './util'

import type { SchedulerEvent, SchedulerEventGroup } from './scheduler-event'
import type { SchedulerNode, SchedulerSyncedSetPayload } from './scheduler-node'
import { Clock } from './clock'

let lastReceivedTime = currentTime

export class SchedulerProcessor extends AudioWorkletProcessor {
  running = false

  clock = new Clock()

  blockSize = 128
  blockTime = this.blockSize / sampleRate

  diffTime = 0

  eventGroups = new SyncedSet<SchedulerEventGroup, SchedulerSyncedSetPayload>({
    send: (_, cb) => cb(),
    pick: core.pickFromLocal,
    reducer: eventGroup => ({
      targets: eventGroup.targets,
    }),
    equal: (prev, next) => (
      prev.targets === next.targets
    ),
  })

  suspended = new Set<string>()

  turns = new Map<SchedulerEventGroup, Map<number, Set<SchedulerEvent>>>()

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
      this.turns.set(eventGroup, new Map())
      this.requestNextEvents(eventGroup.id, 0, 2)
    })

    this.eventGroups.on('delete', (eventGroup) => {
      this.turns.delete(eventGroup)
    })
  }

  setBpm(bpm: number) {
    this.clock.coeff = bpm / (60 * 4)
    this.blockTime = (this.blockSize / sampleRate) * this.clock.coeff
  }

  setClockBuffer(clockBuffer: Float64Array) {
    this.clock.buffer = clockBuffer
  }

  start(playbackStartTime = currentTime, offsetStartTime = 0) {
    this.running = true
    this.diffTime = playbackStartTime - currentTime
    this.clock.internalTime = -this.diffTime * this.clock.coeff + offsetStartTime
    lastReceivedTime = currentTime
  }

  stop() {
    this.running = false
  }

  suspendTarget(targetId: string) {
    out: for (const eventGroup of this.eventGroups) {
      for (const target of eventGroup.targets) {
        if (target.id === targetId) {
          target.midiQueue.clear()
          break out
        }
      }
    }
    this.suspended.add(targetId)
  }

  resumeTarget(targetId: string) {
    this.suspended.delete(targetId)
  }

  clearEventGroup(eventGroupId: string) {
    const eventGroup = [...this.eventGroups]
      .find((eventGroup) =>
        eventGroup.id === eventGroupId
      )
    this.turns.get(eventGroup!)!.clear()
  }

  waitingEvents = new Set<string>()

  receiveEvents(eventGroupId: string, turn: number, turns: Set<SchedulerEvent>[], clear?: boolean) {
    for (let i = turn; i < turn + turns.length; i++) {
      this.waitingEvents.delete(`${[eventGroupId, i]}`)
    }

    const eventGroup = [...this.eventGroups]
      .find((eventGroup) =>
        eventGroup.id === eventGroupId
      )

    if (!eventGroup) {
      throw new Error(`Event group with id "${eventGroupId}" not found`)
    }

    const map = this.turns.get(eventGroup)!
    if (clear) map.clear()

    for (let i = turn, x = 0; i < turn + turns.length; i++) {
      map.set(i, turns[x++])
    }
  }

  process() {
    if (!this.running) return true

    const now = currentTime
    const elapsedTime = now - lastReceivedTime
    lastReceivedTime = now

    const prevInternalTime = this.clock.internalTime

    this.clock.internalTime += elapsedTime * this.clock.coeff

    if (prevInternalTime < 0 && this.clock.internalTime > 0) {
      this.clock.internalTime = 0
      this.clock.offsetFrame = currentFrame
    }

    for (const eventGroup of this.eventGroups) {
      const { needTurn, results: events } = getEventsInRange(
        this.clock.internalTime,
        this.blockTime,
        eventGroup,
        this.turns.get(eventGroup)!,
      )

      for (const target of eventGroup.targets) {
        if (this.suspended.has(target.id)) continue

        for (const [receivedTime, event] of events) {
          target.midiQueue.push(receivedTime, ...event.midiEvent.data)
        }
      }

      if (
        needTurn >= 0
        && (
          !this.waitingEvents.has(`${[eventGroup.id, needTurn]}`)
          || !this.waitingEvents.has(`${[eventGroup.id, needTurn + 1]}`)
        )
        && (
          !this.turns.get(eventGroup)!.has(needTurn)
          || !this.turns.get(eventGroup)!.has(needTurn + 1)
        )
      ) {
        this.requestNextEvents(eventGroup.id, needTurn, 2)
      }
    }

    return true
  }

  requestNextEvents(eventGroupId: string, turn: number, total: number) {
    try {
      this.node.requestNextEvents(eventGroupId, turn, total)
      for (let i = 0; i < total; i++) {
        this.waitingEvents.add(`${[eventGroupId, turn + i]}`)
      }
    } catch (error) {
      console.warn(error)
    }
  }
}

registerProcessor('scheduler', SchedulerProcessor)

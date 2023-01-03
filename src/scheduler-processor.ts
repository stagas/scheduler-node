import { Bob } from 'alice-bob'
import { SyncedSet } from 'synced-set'

import { core } from './scheduler-core'
import { getEventsInRange } from './util'

import type { SchedulerEvent, SchedulerEventGroup } from './scheduler-event'
import type { SchedulerNode, SchedulerSyncedSetPayload } from './scheduler-node'

let lastReceivedTime = currentTime

export class SchedulerProcessor extends AudioWorkletProcessor {
  blockSize = 128

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
      this.requestNextEvents(eventGroup.id, 0)
    })

    this.eventGroups.on('delete', (eventGroup) => {
      this.turns.delete(eventGroup)
    })
  }

  async start(playbackStartTime = currentTime) {
    this.running = true
    this.diffTime = playbackStartTime - currentTime
    this.playbackStartTime = playbackStartTime
    this.adjustedStartTime = this.playbackStartTime * this.coeff
    this.internalTime = -this.diffTime

    lastReceivedTime = currentTime

    return this.playbackStartTime
  }

  stop() {
    this.running = false

    this.eventGroups.forEach((eventGroup) => {
      this.turns.get(eventGroup)!.clear()
      this.requestNextEvents(eventGroup.id, 0)
    })
  }

  async setBpm(bpm: number) {
    this.bpm = bpm

    this.coeff = 1 / ((60 * 4) / this.bpm)
    this.quantumDurationTime = (this.blockSize / sampleRate) * this.coeff

    return this.coeff
  }

  suspendTarget(targetId: string) {
    this.suspended.add(targetId)
  }

  resumeTarget(targetId: string) {
    this.suspended.delete(targetId)
  }

  waitingEvents = new Set<string>()

  receiveEvents(eventGroupId: string, turn: number, [turn0, turn1]: Set<SchedulerEvent>[], clear?: boolean) {
    this.waitingEvents.delete(`${[eventGroupId, turn]}`)
    this.waitingEvents.delete(`${[eventGroupId, turn + 1]}`)

    const eventGroup = [...this.eventGroups]
      .find((eventGroup) =>
        eventGroup.id === eventGroupId
      )

    if (!eventGroup) {
      throw new Error(`Event group with id "${eventGroupId}" not found`)
    }

    const map = this.turns.get(eventGroup)!
    if (clear) map.clear()
    map.set(turn, turn0)
    map.set(turn + 1, turn1)
  }

  process() {
    if (!this.running) return true

    const now = currentTime
    const elapsedTime = now - lastReceivedTime
    lastReceivedTime = now

    const prevInternalTime = this.internalTime
    this.internalTime += elapsedTime * this.coeff
    if (prevInternalTime < 0 && this.internalTime > 0) {
      this.internalTime = 0
      this.playbackStartTime = now + 0.001
    }

    for (const eventGroup of this.eventGroups) {
      const { needTurn, results: events } = getEventsInRange(
        this.turns.get(eventGroup)!,
        eventGroup.loop,
        eventGroup.loopStart,
        eventGroup.loopEnd,
        this.internalTime,
        this.playbackStartTime,
        this.quantumDurationTime,
      )

      for (const target of eventGroup.targets) {
        if (this.suspended.has(target.id)) continue

        for (const [receivedTime, event] of events) {
          target.midiQueue.push(receivedTime, ...event.midiEvent.data)
        }
      }

      if (
        needTurn >= 0
        && !this.waitingEvents.has(`${[eventGroup.id, needTurn]}`)
        && !this.turns.get(eventGroup)!.has(needTurn)
      ) {
        this.requestNextEvents(eventGroup.id, needTurn)
      }
    }

    return true
  }

  requestNextEvents(eventGroupId: string, turn: number) {
    this.waitingEvents.add(`${[eventGroupId, turn]}`)
    this.waitingEvents.add(`${[eventGroupId, turn + 1]}`)
    this.node.requestNextEvents(eventGroupId, turn)
  }
}

registerProcessor('scheduler', SchedulerProcessor)

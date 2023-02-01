import { ValuesOf } from 'everyday-types'
import { cheapRandomId } from 'everyday-utils'
import { ImmSet } from 'immutable-map-set'
import { createMidiNoteEvents } from 'webaudio-tools/midi-events'

import { MessageQueue } from './message-queue'
import { SchedulerNode } from './scheduler-node'
import { SchedulerTargetNode } from './scheduler-target-node'

export type NoteEvent = [number, number, number, number]

export const LoopKind = {
  Once: 0,
  Loop: 1,
  Live: 2,
} as const
export type LoopKind = ValuesOf<typeof LoopKind>

export class SchedulerEvent {
  id = cheapRandomId()

  midiEvent = {
    data: new Uint8Array(3),
    receivedTime: 0,
  } as {
    data: Uint8Array
    receivedTime: number
  }

  constructor(data: Partial<SchedulerEvent> = {}) {
    this.id = data.id ?? this.id
    if (data.midiEvent) {
      this.midiEvent.data = data.midiEvent.data
      this.midiEvent.receivedTime = data.midiEvent.receivedTime
    }
  }

  toJSON() {
    return {
      id: this.id,
      midiEvent: {
        receivedTime: this.midiEvent.receivedTime ?? 0,
        data: this.midiEvent.data,
      },
    }
  }
}

export class SchedulerTarget {
  id = cheapRandomId()

  midiQueue = new MessageQueue().clear()

  constructor(data: Partial<SchedulerTarget> = {}) {
    Object.assign(this, data)
  }
}

export class SchedulerEventGroup {
  id = cheapRandomId()

  targets = new ImmSet<SchedulerTarget>()

  scheduler?: SchedulerNode

  loopPoints = new Float64Array(
    new SharedArrayBuffer(
      3 // [loopActive, loopStart, loopEnd]
      * Float64Array.BYTES_PER_ELEMENT
    )
  )

  constructor(eventGroup: Partial<SchedulerEventGroup> = {}) {
    Object.assign(this, eventGroup)
  }

  toJSON() {
    return {
      id: this.id,
      targets: this.targets,
      loopPoints: this.loopPoints,
    }
  }

  get loop() {
    return this.loopPoints[0] as LoopKind
  }
  set loop(value: LoopKind) {
    this.loopPoints[0] = value
  }

  get loopStart() {
    return this.loopPoints[1]
  }
  set loopStart(seconds: number) {
    this.loopPoints[1] = seconds
  }

  get loopEnd() {
    return this.loopPoints[2]
  }
  set loopEnd(seconds: number) {
    this.loopPoints[2] = seconds
  }

  declare onRequestNotes?: (turn: number, total: number) => void

  setMidiEvents(turnEvents: WebMidi.MIDIMessageEvent[][], turn = 0, clear?: boolean) {
    const turns: Set<SchedulerEvent>[] = turnEvents.map(() => new Set())

    for (const [i, midiEvents] of turnEvents.entries()) {
      const events = turns[i]
      for (const midiEvent of midiEvents) {
        const event = new SchedulerEvent({ midiEvent })
        events.add(event)
      }
    }

    this.scheduler?.worklet.receiveEvents(this.id, turn, turns, clear)

    return turnEvents
  }

  setNotes(turnNotes: NoteEvent[][], turn = 0, clear?: boolean) {
    const midiEvents = turnNotes.map(note => getMidiEventsForNotes(note))
    return this.setMidiEvents(midiEvents, turn, clear)
  }
}

export function getMidiEventsForNotes(notes: NoteEvent[], bars?: number, sampleRate: number = 44100) {
  const midiEvents = []

  // eslint-disable-next-line prefer-const
  for (let [i, [time, note, velocity, length]] of notes.entries()) {
    if (time != null && note != null && velocity != null) {
      if (!length) {
        length = ((notes[i + 1]?.[0] ?? bars) - time) - (1 / sampleRate) * 2
      }
      midiEvents.push(...createMidiNoteEvents(time, note, velocity, length))
    }
  }

  return midiEvents
}

export class SchedulerEventGroupNode extends EventTarget {
  eventGroup = new SchedulerEventGroup()
  targetNodes = new Set<SchedulerTargetNode>()

  declare onconnectchange: (ev: CustomEvent) => void

  constructor(public schedulerNode: SchedulerNode) {
    super()
    this.schedulerNode.addEventGroup(this.eventGroup)
  }

  destroy() {
    this.schedulerNode.removeEventGroup(this.eventGroup)
  }

  suspend(targetNode: SchedulerTargetNode) {
    this.schedulerNode?.worklet.suspendTarget(targetNode.id)
  }

  resume(targetNode: SchedulerTargetNode) {
    this.schedulerNode?.worklet.resumeTarget(targetNode.id)
  }

  clear() {
    this.schedulerNode?.worklet.clearEventGroup(this.eventGroup.id)
  }

  connect(targetNode: SchedulerTargetNode) {
    this.schedulerNode.connect(targetNode)
    this.targetNodes.add(targetNode)
    this.eventGroup.targets = this.eventGroup.targets.add(targetNode.schedulerTarget)
    this.dispatchEvent(new CustomEvent('connectchange'))
    return targetNode
  }

  disconnect(targetNode: SchedulerTargetNode) {
    this.schedulerNode.disconnect(targetNode)
    this.targetNodes.delete(targetNode)
    this.eventGroup.targets = this.eventGroup.targets.delete(targetNode.schedulerTarget)
    this.dispatchEvent(new CustomEvent('connectchange'))
  }
}

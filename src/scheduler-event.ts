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

  playedAt = -1

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
  events?: { id: string, turn: number, events: Set<SchedulerEvent> }

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
      events: this.events,
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

  declare onRequestNotes?: (turn: number) => void

  setMidiEvents(midiEvents: WebMidi.MIDIMessageEvent[], turn = 0) {
    const events = new Set<SchedulerEvent>()
    for (const midiEvent of midiEvents) {
      const event = new SchedulerEvent({ midiEvent })
      events.add(event)
    }
    this.events = { id: cheapRandomId(), turn, events }
    return midiEvents
  }

  setNotes(notes: NoteEvent[], turn = 0) {
    const midiEvents = getMidiEventsForNotes(notes)
    return this.setMidiEvents(midiEvents, turn)
  }
}

export function getMidiEventsForNotes(notes: NoteEvent[]) {
  const midiEvents = []

  for (const [time, note, velocity, length] of notes) {
    midiEvents.push(...createMidiNoteEvents(time, note, velocity, length))
  }

  return midiEvents
}

export class SchedulerEventGroupNode extends EventTarget {
  eventGroup = new SchedulerEventGroup()
  targetNodes = new Set<SchedulerTargetNode>()

  declare onconnectchange: (ev: CustomEvent) => void

  constructor(public schedulerNode: SchedulerNode) {
    super()
    this.schedulerNode.eventGroups.add(this.eventGroup)
  }

  destroy() {
    this.schedulerNode.eventGroups.delete(this.eventGroup)
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

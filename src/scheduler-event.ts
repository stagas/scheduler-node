import { cheapRandomId } from 'everyday-utils'
import { ImmSet } from 'immutable-map-set'
import { createMidiNoteEvents } from 'webaudio-tools/midi-events'

import { MessageQueue } from './message-queue'
import { SchedulerNode } from './scheduler-node'
import { SchedulerTargetNode } from './scheduler-target-node'

export class SchedulerEvent {
  id = cheapRandomId()

  midiEvent = { data: new Uint8Array(3), receivedTime: 0 }

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
  events = new ImmSet<SchedulerEvent>()

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
    return !!this.loopPoints[0]
  }
  set loop(value: boolean) {
    this.loopPoints[0] = +value
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

  replaceAllWithNotes(notes: [number, number, number, number][]) {
    const midiEvents = []

    for (const [time, note, velocity, length] of notes) {
      midiEvents.push(...createMidiNoteEvents(time, note, velocity, length))
    }

    this.events = this.events.clear()

    for (const midiEvent of midiEvents) {
      const event = new SchedulerEvent({ midiEvent })
      this.events = this.events.add(event)
    }

    return midiEvents
  }
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

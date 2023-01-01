import { Agent, Alice } from 'alice-bob'
import { queue } from 'event-toolkit'
import { SyncedSet } from 'synced-set'

import { core } from './scheduler-core'
import { SchedulerEvent, SchedulerEventGroup, SchedulerTarget } from './scheduler-event'

import type { ImmSet } from 'immutable-map-set'
import type { SchedulerProcessor } from './scheduler-processor'
import type { SchedulerTargetNode } from './scheduler-target-node'

export interface SchedulerSyncedSetPayload {
  targets: ImmSet<SchedulerTarget>
  events?: { id: string, events: Set<SchedulerEvent> }
}

export class SchedulerNode extends EventTarget {
  private static registeredCtx = new WeakSet<BaseAudioContext>()

  static async register(context: BaseAudioContext) {
    if (this.registeredCtx.has(context)) return
    // @ts-ignore
    await context.audioWorklet.addModule(new URL('./scheduler-processor.js', import.meta.url).href)
    this.registeredCtx.add(context)
  }

  static async create(context: BaseAudioContext) {
    await this.register(context)
    return new this(context)
  }

  node: AudioWorkletNode
  worklet: Agent<SchedulerProcessor, SchedulerNode>

  targetNodes = new Set<SchedulerTargetNode>()

  eventGroups = new SyncedSet<SchedulerEventGroup, SchedulerSyncedSetPayload>({
    send: queue.task((payload, cb) => {
      //!? 'sending'
      this.node.port.postMessage({ eventGroups: core.serialize(payload) })
      cb()
    }),
    pick: [],
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

  createEventGroup() {
    const eventGroup = new SchedulerEventGroup()
    this.eventGroups.add(eventGroup)
    return eventGroup
  }

  removeEventGroup(eventGroup: SchedulerEventGroup) {
    this.eventGroups.delete(eventGroup)
  }

  requestNextEvents(id: string, turn = 0) {
    [...this.eventGroups].find((eventGroup) => eventGroup.id === id)?.onRequestNotes?.(turn)
  }

  constructor(public context: BaseAudioContext) {
    super()

    this.node = new AudioWorkletNode(this.context, 'scheduler')

    const [scheduler, worklet] = new Alice<SchedulerNode, SchedulerProcessor>(
      data => void this.node.port.postMessage({ rpc: data }),
      this
    ).agents({ debug: false })

    this.node.port.onmessage = ({ data }) => {
      if (data.rpc) scheduler.receive(data.rpc)
    }

    // TODO: handle onprocessorerror
    this.worklet = worklet
  }

  start(playbackStartTime?: number) {
    return this.worklet.start(playbackStartTime)
  }

  stop() {
    this.worklet.stop()
  }

  setBpm(bpm: number) {
    return this.worklet.setBpm(bpm)
  }

  connect(targetNode: SchedulerTargetNode) {
    if (!this.targetNodes.has(targetNode)) {
      this.node.connect(targetNode, 0, targetNode.numberOfInputs - 1)
    }
    return targetNode
  }

  disconnect(targetNode: SchedulerTargetNode) {
    if (this.targetNodes.has(targetNode)) {
      this.node.disconnect(targetNode, 0, targetNode.numberOfInputs - 1)
    }
  }
}

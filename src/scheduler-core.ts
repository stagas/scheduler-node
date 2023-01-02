import { ImmSet } from 'immutable-map-set'
import { createContext as createObjectifyContext } from 'json-objectify'
import { createContext as createSerializeContext, thru } from 'serialize-whatever'

import { MessageQueue } from './message-queue'
import { SchedulerEvent, SchedulerEventGroup, SchedulerTarget } from './scheduler-event'

const deserializableClasses = [
  SchedulerEventGroup,
  SchedulerEvent,
  SchedulerTarget,
  MessageQueue,
  ImmSet,
]

const { replacer, reviver } = createSerializeContext([
  [Float64Array, [thru, thru]],
  [Uint8Array, [thru, thru]],
])

const { objectify, deobjectify } = createObjectifyContext([Float64Array, Uint8Array])

export const core = {
  pickFromLocal: ['id', 'targets', 'loopPoints'] as (keyof SchedulerEventGroup)[],
  serialize: (data: any) => objectify(data, replacer(data)),
  deserialize: (data: any) => deobjectify(data, reviver(deserializableClasses)) as any,
}

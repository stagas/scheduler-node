import { Bob } from 'alice-bob'
import { MessageQueue } from './message-queue'
import { MIDIMessageEvent } from './midi'
import type { SchedulerTargetNode } from './scheduler-target-node'

export { MIDIMessageEvent }

export * from './clock'

const sortByFrame = (a: MIDIMessageEvent, b: MIDIMessageEvent) => a.offsetFrame - b.offsetFrame

const midiEvents: MIDIMessageEvent[] = []
const midiEventPool = Array.from(
  { length: 128 },
  () => new MIDIMessageEvent('midimessage', { data: new Uint8Array(3) })
)
let midiEventPoolPtr = 0

export abstract class SchedulerTargetProcessor extends AudioWorkletProcessor {
  private midiQueue = new MessageQueue()

  private didError = false

  isReady = false

  constructor() {
    super()

    const [worklet] = new Bob<SchedulerTargetProcessor, SchedulerTargetNode>(
      data => this.port.postMessage(data),
      this
    ).agents({ debug: false })

    this.port.onmessage = ({ data }) => worklet.receive(data)
  }

  async resetError() {
    this.didError = false
  }

  async init(buffer: MessageQueue['buffer']) {
    this.midiQueue.buffer = buffer
  }

  abstract processMidiEvents(midiEvents?: MIDIMessageEvent[]): void

  abstract processWithMidi(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
    midiEvents: MIDIMessageEvent[],
  ): boolean

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean {
    if (!this.isReady) return true
    if (this.didError) return true

    // TODO: optimizations possible:
    //  reuse midiEvents
    //  events pool
    //  sort by hash?

    let message: MessageQueue['buffer'] | void

    let prevFrame = 0

    let max = 16

    midiEvents.splice(0)

    while ((message = this.midiQueue.slice(4)) && max--) {
      const event = midiEventPool[midiEventPoolPtr]
      midiEventPoolPtr = (midiEventPoolPtr + 1) % midiEventPool.length
      event.data.set(message.subarray(1))
      event.receivedTime = message[0] //message[0] < 0 ? (currentTime * 1000) : message[0]
      event.receivedFrame = Math.floor(event.receivedTime * 0.001 * sampleRate)
      event.offsetFrame = Math.max(0, event.receivedFrame - currentFrame)
      event.deltaFrame = Math.max(0, event.offsetFrame - prevFrame)
      prevFrame = event.offsetFrame
      midiEvents.push(event)
    }

    if (midiEvents.length) {
      midiEvents.sort(sortByFrame)
      this.processMidiEvents(midiEvents)
    }

    try {
      return this.processWithMidi(inputs, outputs, parameters, midiEvents)
    } catch (error) {
      console.warn('Processor errored. Maybe currentTime is not set yet?')
      console.warn(error)
      this.didError = true
      return true
    }
  }
}

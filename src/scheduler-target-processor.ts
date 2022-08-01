import { Bob } from 'alice-bob'
import { MessageQueue } from './message-queue'
import { MIDIMessageEvent } from './midi'
import type { SchedulerTargetNode } from './scheduler-target-node'

export { MIDIMessageEvent }

const sortByFrame = (a: MIDIMessageEvent, b: MIDIMessageEvent) => a.offsetFrame - b.offsetFrame

export abstract class SchedulerTargetProcessor extends AudioWorkletProcessor {
  private midiQueue = new MessageQueue()

  constructor() {
    super()

    const [worklet] = new Bob<SchedulerTargetProcessor, SchedulerTargetNode>(
      data => this.port.postMessage(data),
      this
    ).agents({ debug: false })

    this.port.onmessage = ({ data }) => worklet.receive(data)
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
    // TODO: optimizations possible:
    //  reuse midiEvents
    //  events pool
    //  sort by hash?
    const midiEvents: MIDIMessageEvent[] = []

    let message: MessageQueue['buffer'] | void

    let prevFrame = 0

    while ((message = this.midiQueue.slice(4))) {
      const event = new MIDIMessageEvent('midimessage', {
        data: new Uint8Array(message.slice(1)),
      })
      // receivedTime === 0 signifies "process as soon as possible"
      // so we give it our currentTime
      event.receivedTime = message[0] || (currentTime * 1000)
      event.receivedFrame = Math.floor(event.receivedTime * 0.001 * sampleRate)
      event.offsetFrame = event.receivedFrame - currentFrame
      event.deltaFrame = Math.max(0, event.offsetFrame - prevFrame)
      prevFrame = event.offsetFrame
      midiEvents.push(event)
    }

    if (midiEvents.length) {
      midiEvents.sort(sortByFrame)
      this.processMidiEvents(midiEvents)
    }

    return this.processWithMidi(inputs, outputs, parameters, midiEvents)
  }
}

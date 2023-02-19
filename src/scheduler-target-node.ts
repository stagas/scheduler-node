import { Agent, Alice } from 'alice-bob'
import { cheapRandomId } from 'everyday-utils'
import { SchedulerTarget } from './scheduler-event'
import type { SchedulerTargetProcessor } from './scheduler-target-processor'

const xfer = (args: any) => {
  const xfers = []
  for (const arg of args) {
    if (arg instanceof MessagePort) {
      xfers.push(arg)
    }
  }
  return xfers
}

export class SchedulerTargetNode extends AudioWorkletNode {
  id = cheapRandomId()

  schedulerTarget = new SchedulerTarget()

  worklet: Agent<SchedulerTargetProcessor, SchedulerTargetNode>

  constructor(context: BaseAudioContext, name: string, options: AudioWorkletNodeOptions = {}) {
    // add a phony tail input, used for connecting the
    // scheduler to execute right before our worklet
    options.numberOfInputs = (options.numberOfInputs ?? 0) + 1

    super(context, name, options)

    const [node, worklet] = new Alice<SchedulerTargetNode, SchedulerTargetProcessor>(
      data => void this.port.postMessage(data, xfer(data.args))
    ).agents({ debug: false })

    this.port.onmessage = ({ data }) => node.receive(data)
    // TODO: handle onprocessorerror
    this.worklet = worklet
  }

  async init() {
    await this.worklet.init(this.schedulerTarget.midiQueue.buffer)
  }

  processMidiEvent(midiEvent: WebMidi.MIDIMessageEvent) {
    if (midiEvent.receivedTime == null) {
      throw new Error('Midi event missing receivedTime')
    }
    this.schedulerTarget.midiQueue.push(
      midiEvent.receivedTime >= 0 ? midiEvent.receivedTime : this.context.currentTime,
      ...midiEvent.data
    )
  }
}

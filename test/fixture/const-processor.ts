import { MIDIMessageEvent, SchedulerTargetProcessor } from '../../dist/esm/scheduler-target-processor'

class ConstProcessor extends SchedulerTargetProcessor {
  value = 0

  processMidiEvents() { }

  processWithMidi(
    _inputs: Float32Array[][],
    outputs: Float32Array[][],
    _parameters: Record<string, Float32Array>,
    events: MIDIMessageEvent[],
  ): boolean {
    // let i = 0

    if (events.length) {
      this.value = events[0].data[1]
      // i = events[0].offsetFrame
      // console.log(i, currentFrame, events[0])
    }

    outputs[0][0].fill(this.value)

    return true
  }
}

registerProcessor('const', ConstProcessor)

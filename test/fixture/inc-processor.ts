import { SchedulerTargetProcessor } from '../../dist/esm/scheduler-target-processor'

class IncProcessor extends SchedulerTargetProcessor {
  count = 0

  processMidiEvents() {}

  processWithMidi(
    _inputs: Float32Array[][],
    outputs: Float32Array[][],
    _parameters: Record<string, Float32Array>,
    events: MIDIMessageEvent[],
  ): boolean {
    if (events.length)
      this.count = events[0].data[1]
    outputs[0][0][0] = ++this.count
    outputs[0][0][1] = ++this.count
    return true
  }
}

registerProcessor('inc', IncProcessor)

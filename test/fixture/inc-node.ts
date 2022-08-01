import { SchedulerTargetNode } from '../..'

export class IncNode extends SchedulerTargetNode {
  static async register(context: BaseAudioContext) {
    // @ts-ignore
    return context.audioWorklet.addModule(new URL('./inc-processor.ts', import.meta.url).href)
  }

  constructor(context: BaseAudioContext) {
    super(context, 'inc')
  }
}

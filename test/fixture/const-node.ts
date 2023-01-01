import { SchedulerTargetNode } from '../..'

export class ConstNode extends SchedulerTargetNode {
  static async register(context: BaseAudioContext) {
    // @ts-ignore
    return context.audioWorklet.addModule(new URL('./const-processor.ts', import.meta.url).href)
  }

  constructor(context: BaseAudioContext) {
    super(context, 'const')
  }
}

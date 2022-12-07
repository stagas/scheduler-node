export class MIDIMessageEvent {
  data: Uint8Array
  type: string
  receivedTime!: number
  receivedFrame!: number
  offsetFrame!: number
  deltaFrame!: number
  constructor(type: string, options: any) {
    this.type = type
    this.data = options.data
  }
}

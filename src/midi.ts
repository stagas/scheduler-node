export class MIDIMessageEvent extends Event implements WebMidi.MIDIMessageEvent {
  data: Uint8Array
  receivedTime!: number
  receivedFrame!: number
  offsetFrame!: number
  deltaFrame!: number
  constructor(type: string, options: any) {
    super(type)
    this.data = options.data
  }
}

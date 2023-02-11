export class Clock {
  buffer = new Float64Array(
    new SharedArrayBuffer(3 * Float64Array.BYTES_PER_ELEMENT)
  )

  get coeff() {
    return this.buffer[0]
  }
  set coeff(value: number) {
    this.buffer[0] = value
  }

  get internalTime() {
    return this.buffer[1]
  }
  set internalTime(value: number) {
    this.buffer[1] = value
  }

  get offsetFrame() {
    return this.buffer[2]
  }
  set offsetFrame(value: number) {
    this.buffer[2] = value
  }
}

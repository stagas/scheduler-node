export class MessageQueue {
  buffer: Float64Array | Float32Array = new Float64Array(
    new SharedArrayBuffer(8192 * 2 * Float64Array.BYTES_PER_ELEMENT)
  )

  constructor(messageQueue: Partial<MessageQueue> = {}) {
    Object.assign(this, messageQueue)
  }

  toJSON() {
    return {
      buffer: this.buffer,
    }
  }

  get readPtr() {
    return this.buffer[0]
  }

  set readPtr(index) {
    this.buffer[0] = index
  }

  get writePtr() {
    return this.buffer[1]
  }

  set writePtr(index) {
    this.buffer[1] = index
  }

  clear() {
    this.buffer.fill(-Infinity)
    this.readPtr = 2
    this.writePtr = 2
    return this
  }

  push(...values: number[]) {
    const buffer = this.buffer
    const ptr = this.writePtr

    buffer.set(values, ptr)

    const nextPtr = ptr + values.length
    if (nextPtr < this.buffer.length) {
      this.writePtr = nextPtr
    }
  }

  shift() {
    const buffer = this.buffer
    const ptr = this.readPtr

    const value = buffer[ptr]
    if (!isFinite(value)) {
      this.readPtr = this.writePtr = 2
      return undefined
    }

    buffer[ptr] = -Infinity

    this.readPtr = ptr + 1
    return value
  }

  slice(length: number) {
    const buffer = this.buffer
    const ptr = this.readPtr

    const slice = buffer.subarray(ptr, ptr + length)
    if (!isFinite(slice[0])) {
      this.buffer.fill(-Infinity, 2, 2 + ptr)
      this.readPtr = this.writePtr = 2
      return undefined
    }

    this.readPtr = ptr + length
    return slice
  }
}

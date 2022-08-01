import { MIDIMessageEvent } from '../src/midi'
import { SchedulerEvent } from '../src/scheduler-event'
import { getEventsInRange } from '../src/util'

let i = 0
Math.random = () => ++i / 1000

const makeEvent = (x: number, receivedTime: number) => {
  const midiEvent = new MIDIMessageEvent('midimessage', { data: new Uint8Array([x, x, x]) })
  midiEvent.receivedTime = receivedTime * 1000
  return new SchedulerEvent({ midiEvent })
}

describe('getEventsInRange()', () => {
  it('start', () => {
    const events = [
      makeEvent(1, 0),
    ]
    const sampleTime = 1 / 44100
    const results = getEventsInRange(events, true, 0, 1, 0, sampleTime, 128 / 44100, 0)
    expect(results).toMatchSnapshot()
  })

  it('edge', () => {
    const events = [
      makeEvent(1, 0),
    ]
    const quantum = 128 / 44100
    const sample = 1 / 44100
    {
      const results = getEventsInRange(events, true, 0, 1 / 5, 12.8 - quantum, sample, quantum, 0)
      expect(results).toMatchSnapshot()
    }
    {
      const results = getEventsInRange(events, true, 0, 1 / 5, 12.8, sample, quantum, 0)
      expect(results).toMatchSnapshot()
    }
    {
      const results = getEventsInRange(events, true, 0, 1 / 5, 12.8 + quantum, sample, quantum, 0)
      expect(results).toMatchSnapshot()
    }
  })
})

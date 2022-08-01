import { SchedulerEvent } from './scheduler-event'

export type EventTuple = [number, SchedulerEvent]

export const getEventsInRange = (
  events: Iterable<SchedulerEvent>,
  loop: boolean,
  loopStart: number,
  loopEnd: number,
  currentTime: number,
  sampleTime: number,
  quantumDurationTime: number,
  playbackStartTime: number,
) => {
  let startTime: number
  let endTime: number
  let offsetTime = 0

  let loopDuration = 0

  const results: EventTuple[] = []

  if (loop) {
    loopDuration = loopEnd - loopStart
    offsetTime = currentTime - playbackStartTime - loopStart
    if (offsetTime < 0) {
      return results
    }

    startTime = offsetTime % loopDuration
    endTime = (startTime + quantumDurationTime) % loopDuration

    if (startTime < sampleTime) startTime = 0
    if (endTime < sampleTime) endTime = 0
  } else {
    startTime = currentTime - playbackStartTime
    endTime = startTime + quantumDurationTime
  }

  for (const event of events) {
    const eventTime = event.midiEvent.receivedTime * 0.001 // ms to seconds
    const isPast = endTime < startTime

    if (
      eventTime === startTime && startTime === endTime
      || (isPast
        ? eventTime >= loopStart && eventTime < endTime
        : eventTime >= startTime && eventTime < endTime)
    ) {
      let receivedTime: number
      if (loop) {
        receivedTime = eventTime
          // ceil or floor whether to go to next bar quantum or this
          + Math[isPast ? 'ceil' : 'floor'](startTime / loopDuration) * loopDuration
          + playbackStartTime
          + (offsetTime - startTime)
      } else {
        // TODO: -startTime ?
        receivedTime = eventTime + playbackStartTime
      }
      receivedTime *= 1000
      results.push([receivedTime, event])
    }
  }

  return results
}

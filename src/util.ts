import { LoopKind, SchedulerEvent } from './scheduler-event'

export type EventTuple = [number, SchedulerEvent]

export const getEventsInRange = (
  allEvents: Map<number, Set<SchedulerEvent>>,
  loop: LoopKind,
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

  let needNext = false

  if (loop) {
    loopDuration = loopEnd - loopStart

    offsetTime = currentTime - loopStart

    startTime = offsetTime % loopDuration

    if (startTime < 0) {
      return { needNext, results }
    }

    endTime = (startTime + quantumDurationTime) % (loopDuration * 2)

    if (startTime < sampleTime) startTime = 0
    if (endTime < sampleTime) endTime = 0

    if (endTime === 0
      || endTime >= (loopDuration - sampleTime)
      || allEvents.size < 2
    ) {
      needNext = true
      endTime = (startTime + quantumDurationTime) % loopDuration
      if (endTime < sampleTime) endTime = 0
    }

  } else {
    startTime = currentTime - playbackStartTime
    endTime = startTime + quantumDurationTime
  }

  const turn = (offsetTime / loopDuration) | 0
  const [prevEvents, nextEvents] = [allEvents.get(turn), allEvents.get(turn + 1)]
  const events = [
    ...[...(prevEvents ?? [])],
    ...[...(nextEvents ?? [])]
      .map((ev) => ({
        ...ev,
        midiEvent: {
          ...ev.midiEvent,
          receivedTime: ev.midiEvent.receivedTime + loopDuration * 1000
        }
      } as SchedulerEvent))
  ]

  const isPast = endTime < startTime
  const offset = Math[isPast ? 'ceil' : 'floor'](startTime / loopDuration) * loopDuration + playbackStartTime + (offsetTime - startTime)

  for (const event of [...events]) {
    const eventTime = event.midiEvent.receivedTime * 0.001 // ms to seconds

    if (loop === LoopKind.Live) {
      if (
        (event.playedAt < 0 || offsetTime < event.playedAt)
        && (
          eventTime === startTime && startTime === endTime
          || (isPast
            ? eventTime >= loopStart && eventTime < endTime
            : eventTime >= startTime && eventTime < endTime)
        )
      ) {
        let receivedTime = eventTime + offset
        event.playedAt = receivedTime
        receivedTime *= 1000
        results.push([receivedTime, event])
      }
    }
    else if (
      eventTime === startTime && startTime === endTime
      || (isPast
        ? eventTime >= loopStart && eventTime < endTime
        : eventTime >= startTime && eventTime < endTime)
    ) {
      let receivedTime: number
      if (loop) {
        receivedTime = eventTime + offset
      } else {
        receivedTime = eventTime + playbackStartTime
      }
      receivedTime *= 1000
      results.push([receivedTime, event])
    }
  }

  return { needNext, results }
}

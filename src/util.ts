import { LoopKind, SchedulerEvent } from './scheduler-event'

export type EventTuple = [number, SchedulerEvent]

export const getEventsInRange = (
  turns: Map<number, Set<SchedulerEvent>>,
  loop: LoopKind,
  loopStart: number,
  loopEnd: number,
  currentTime: number,
  playbackStartTime: number,
  quantumDurationTime: number,
) => {
  let startTime: number
  let endTime: number
  let offsetTime = 0

  let loopDuration = 0

  const results: EventTuple[] = []

  let needTurn = 0
  let turn = 0

  if (loop) {
    loopDuration = loopEnd - loopStart

    offsetTime = currentTime - loopStart

    turn = (offsetTime / loopDuration) | 0
    needTurn = turn

    startTime = offsetTime

    if (startTime < 0) {
      return { needTurn, results }
    }

    endTime = startTime + quantumDurationTime
  } else {
    startTime = currentTime - playbackStartTime
    endTime = startTime + quantumDurationTime
  }

  for (let t = 0; t <= 1; t++) {
    const events = turns.get(turn + t)
    const offset = loopDuration * (turn + t)
      // arbitrary but fixes double and missing notes
      // so that the comparisons are always > and not >= which
      // collides the end with the start sometimes
      + 0.00001

    if (events) for (const event of events) {
      const eventTime = event.midiEvent.receivedTime * 0.001 // ms to seconds
        + offset

      if (eventTime > endTime) break

      if (eventTime > startTime) {
        let receivedTime = eventTime
        receivedTime *= 1000
        results.push([receivedTime, event])
      }
    }
  }

  return { needTurn, results }
}

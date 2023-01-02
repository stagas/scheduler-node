import { LoopKind, SchedulerEvent } from './scheduler-event'

export function roundPrecision(num: number, precision: number) {
  const factor = Math.pow(10, precision.toString().split('.')[1].length);
  return Math.round(num * factor) / factor;
}

export function floorPrecision(num: number, precision: number) {
  const factor = Math.pow(10, precision.toString().split('.')[1].length);
  return Math.floor(num * factor) / factor;
}

export function ceilPrecision(num: number, precision: number) {
  const factor = Math.pow(10, precision.toString().split('.')[1].length);
  return Math.ceil(num * factor) / factor;
}

export type EventTuple = [number, SchedulerEvent]
let prevTurn = -1
export const getEventsInRange = (
  turns: Map<number, Set<SchedulerEvent>>,
  loop: LoopKind,
  loopStart: number,
  loopEnd: number,
  currentTime: number,
  playbackStartTime: number,
  quantumDurationTime: number,
  sampleTime: number,
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
    needTurn = turn + 2
    if (turn !== prevTurn) {
      prevTurn = turn
    }

    startTime = offsetTime % loopDuration

    if (startTime < 0) {
      return { needTurn, results }
    }

    endTime = startTime + quantumDurationTime
    endTime = ceilPrecision(endTime, sampleTime)

    if (startTime < sampleTime) {
      startTime = floorPrecision(startTime, sampleTime)
    }
  } else {
    startTime = currentTime - playbackStartTime
    endTime = startTime + quantumDurationTime
  }

  const isPast = endTime < startTime

  const offset = Math[isPast ? 'ceil' : 'floor'](startTime / loopDuration) * loopDuration + playbackStartTime + (offsetTime - startTime)

  for (let t = 0; t <= 1; t++) {
    const events = turns.get(turn + t)
    if (events) for (const event of events) {
      const eventTime = event.midiEvent.receivedTime * 0.001 // ms to seconds
        + loopDuration * t

      if (eventTime > endTime) break

      if (loop === LoopKind.Live) {
        if (eventTime >= startTime) {
          let receivedTime = eventTime + offset
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
  }

  return { needTurn, results }
}

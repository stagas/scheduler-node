import { createMidiNoteEvents } from 'webaudio-tools/midi-events'

export function getMidiEventsForNotes(notes: NoteEvent[], bars?: number, sampleRate: number = 44100) {
  const midiEvents = []

  // eslint-disable-next-line prefer-const
  for (let [i, [time, note, velocity, length]] of notes.entries()) {
    if (time != null && note != null && velocity != null) {
      if (!length) {
        length = ((notes[i + 1]?.[0] ?? bars) - time) - (1 / sampleRate) * 2
      }
      midiEvents.push(...createMidiNoteEvents(time, note, velocity, length))
    }
  }

  return midiEvents
}

export type NoteEvent = [number, number, number] | [number, number, number, number]

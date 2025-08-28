import Note, { UserInputNote } from './note';
import {mtof} from './convert';
import {isString, isNumber, transpose} from './utilities';
import {pitchNames} from './circles';
import validateNoteName from './validators/note';
import {scientificToAbc} from './abc';

class Pitch extends Note {
  octave: number;
  scientific: string;
  abc: string;
  midi: number;
  frequency: number;

  constructor(noteName: string, octave: number);
  constructor(scientificNotation: string);
  constructor(midiNumber: number);
  constructor(noteInput: string|number, octave?: number) {
    if (isNumber(noteInput)) {
      // Handle MIDI number input
      const name = pitchNames.atIndex(noteInput);
      const parsed = validateNoteName(name).parse();
      if (!parsed) {
        throw new Error('Invalid note name from MIDI number.');
      }
      super(parsed.step + parsed.accidental);
      this.setOctave(Math.floor(noteInput / 12) - 1);
    } else if (isString(noteInput)) {
      const parsed = validateNoteName(noteInput).parse();
      if (!parsed) {
        throw new Error('Invalid note name.');
      }
      if (parsed.octave !== null) {
        // Handle scientific notation (e.g., "C4")
        super(parsed.step + parsed.accidental);
        this.setOctave(parsed.octave);
      } else if (octave !== undefined) {
        // Handle note name + octave parameters (e.g., "C", 4)
        super(noteInput);
        this.setOctave(octave);
      } else {
        throw new Error('Octave must be specified for Pitch. Use Note class for notes without octave.');
      }
    } else {
      throw new TypeError('Input must be a string (note name or scientific notation) or number (MIDI).');
    }
  }

  private setOctave(octave: number) {
    if (!isNumber(octave)) {
      throw new TypeError('Octave must be a number.');
    }
    this.octave = octave;
    this.scientific = this.name + octave.toString(10);
    this.abc = scientificToAbc(this.scientific);
    this.midi = pitchNames.indexOf(this.scientific);
    this.frequency = mtof(this.midi);
  }

  isEquivalent(other: UserInputNote) {
    const otherNote = toNote(other);
    if (this.name !== otherNote.name) {
      return false;
    }
    if (otherNote instanceof Pitch && this.octave !== otherNote.octave) {
      return false;
    }
    return true;
  }

  isEnharmonic(other: UserInputNote) {
    const otherNote = toNote(other);
    if (this.pitchClass !== otherNote.pitchClass) {
      return false;
    }
    if (otherNote instanceof Pitch && (Math.abs(this.midi - otherNote.midi) > 11)) {
      return false;
    }
    return true;
  }

  transpose(direction: string, interval: string): Pitch {
    return new Pitch(transpose(this.scientific, direction, interval));
  }

  up(interval: string): Pitch {
    return this.transpose('up', interval);
  }

  down(interval: string): Pitch {
    return this.transpose('down', interval);
  }

  toString() {
    return '[pitch ' + this.scientific + ']';
  }
}

function toNote(input: UserInputNote): Note | Pitch {
  if (isString(input)) {
    const parsed = validateNoteName(input).parse();
    if (!parsed) {
      throw new Error('Invalid note name.');
    }
    if (parsed.octave !== null) {
      return new Pitch(input);
    } else {
      return new Note(input);
    }
  } else {
    return input;
  }
}

export default Pitch;
export { toNote };

import {mtof} from './convert';
import {isString, isNumber, transpose} from './utilities';
import {fifths, intervals, pitchNames} from './circles';
import validateNoteName from './validators/note';
import {scientificToAbc} from './abc';


interface INote {
  name: string;
  type: 'note'|'pitch';
  pitchClass: number;
  parts: {
    step: string;
    accidental: string;
  }
}
interface IPitch {
  octave: number;
  scientific: string;
  abc: string;
  midi: number;
  frequency: number;
}

type UserInputNote = Note | string;

class Note implements INote, IPitch {

  name: string;
  type: 'note'|'pitch';
  pitchClass: number;
  parts: {
    step: string;
    accidental: string;
  }
  octave: number;
  scientific: string;
  abc: string;
  midi: number;
  frequency: number;

  constructor(noteName: string);
  constructor(midiNumber: number);
  constructor(noteInput: string|number) {
    let name;
    if (isString(noteInput)) {
      name = noteInput;
    } else if (isNumber(noteInput)) {
      name = pitchNames.atIndex(noteInput);
    } else {
      throw new TypeError('Note name must be a string or number.');
    }

    const parsed = validateNoteName(name).parse();
    if (!parsed) {
      throw new Error('Invalid note name.');
    }

    this.name = name;
    this.type = 'note';
    this.pitchClass = pitchNames.indexOf(parsed.step + parsed.accidental);

    this.parts = {
      step: parsed.step,
      accidental: parsed.accidental
    };

    if (parsed.octave !== null) {
      this.setOctave(parsed.octave);
    }
  }

  setOctave(octave: number) {
    if (!isNumber(octave)) {
      throw new TypeError('Octave must be a number.');
    }
    this.name = this.parts.step + this.parts.accidental;
    this.type = 'pitch';
    this.octave = octave;
    this.scientific = this.name + octave.toString(10);
    this.abc = scientificToAbc(this.scientific);
    this.midi = pitchNames.indexOf(this.scientific);
    this.frequency = mtof(this.midi);
  }

  isEquivalent(other: UserInputNote) {
    other = toNote(other);
    if (this.name !== other.name) {
      return false;
    }
    if (this.type === 'pitch' && other.type === 'pitch' && this.octave !== other.octave) {
      return false;
    }
    return true;
  }

  isEnharmonic(other: UserInputNote) {
    const otherNote = toNote(other);
    if (this.pitchClass !== otherNote.pitchClass) {
      return false;
    }
    if (this.type === 'pitch' && otherNote.type === 'pitch' && (Math.abs(this.midi - otherNote.midi) > 11)) {
      return false;
    }
    return true;
  }
  
  transpose(direction: string, interval: string): Note {
    return new Note(transpose(this.type === 'pitch' ? this.scientific : this.name, direction, interval));
  }

  intervalTo(note: UserInputNote): string {
    const otherNote = toNote(note);
    return intervals.atIndex(fifths.indexOf(otherNote.name) - fifths.indexOf(this.name));
  }

  intervalFrom(note: UserInputNote): string {
    const otherNote = toNote(note);
    return intervals.atIndex(fifths.indexOf(this.name) - fifths.indexOf(otherNote.name));
  }

  up(interval: string): Note {
    return this.transpose('up', interval);
  }

  down(interval: string): Note {
    return this.transpose('down', interval);
  }

  toString() {
    let name;
    if (this.type === 'note') {
      name = this.name;
    } else if (this.type === 'pitch'){
      name = this.scientific;
    }
    return '[note ' + name + ']';
  }

}


function toNote(input: UserInputNote): Note {
  if (isString(input)) {
    return new Note(input);
  } else {
    return input;
  }
}

export default Note;
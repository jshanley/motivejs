import {isString, isNumber, transpose} from './utilities';
import {fifths, intervals, pitchNames} from './circles';
import validateNoteName from './validators/note';
import Pitch from './pitch';



type UserInputNote = Note | string;

class Note {
  name: string;
  pitchClass: number;
  parts: {
    step: string;
    accidental: string;
  }

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

    // For Note class, we only store the note name without octave
    this.name = parsed.step + parsed.accidental;
    this.pitchClass = pitchNames.indexOf(parsed.step + parsed.accidental);

    this.parts = {
      step: parsed.step,
      accidental: parsed.accidental
    };
  }

  isEquivalent(other: UserInputNote) {
    let otherNote: Note;
    if (isString(other)) {
      otherNote = new Note(other);
    } else {
      otherNote = other;
    }
    return this.name === otherNote.name;
  }

  isEnharmonic(other: UserInputNote) {
    let otherNote: Note;
    if (isString(other)) {
      otherNote = new Note(other);
    } else {
      otherNote = other;
    }
    return this.pitchClass === otherNote.pitchClass;
  }
  
  transpose(direction: string, interval: string): Note {
    return new Note(transpose(this.name, direction, interval));
  }

  intervalTo(note: UserInputNote): string {
    let otherNote: Note;
    if (isString(note)) {
      otherNote = new Note(note);
    } else {
      otherNote = note;
    }
    return intervals.atIndex(fifths.indexOf(otherNote.name) - fifths.indexOf(this.name));
  }

  intervalFrom(note: UserInputNote): string {
    let otherNote: Note;
    if (isString(note)) {
      otherNote = new Note(note);
    } else {
      otherNote = note;
    }
    return intervals.atIndex(fifths.indexOf(this.name) - fifths.indexOf(otherNote.name));
  }

  up(interval: string): Note {
    return this.transpose('up', interval);
  }

  down(interval: string): Note {
    return this.transpose('down', interval);
  }

  toString() {
    return '[note ' + this.name + ']';
  }

}

export default Note;
export { UserInputNote };
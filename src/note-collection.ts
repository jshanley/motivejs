import Note from './note';
import Interval from './interval';
import {toObject} from './utilities';
import Pattern from './pattern';

class NoteCollection {

  array: Note[]

  constructor(noteArray: (Note|string)[] = []) {
    this.array = noteArray.map(function(d) {
      return toObject(d, toNote);
    });
  }

  contents() {
    return this.array;
  }

  each(fn: (value: Note, index: number, array: Note[]) => void) {
    this.array.forEach(fn);
    return this;
  }

  contains(item: Note|string): boolean {
    const note = toObject(item, toNote);
    var output = false;
    this.each(function(d) {
      if (d.isEquivalent(note)) output = true;
    });
    return output;
  }

  add(item: Note|string) {
    const note = toObject(item, toNote);
    this.array.push(note);
    return this;
  }

  remove(item: Note|string) {
    const note = toObject(item, toNote);
    this.array = this.array.filter(function(d) {
      return !d.isEquivalent(note);
    });
    return this;
  }

  map(fn: (value: Note, index: number, array: Note[]) => Note|string) {
    return new NoteCollection(this.array.map(fn));
  }

  names() {
    return this.array.map(function(d) {
      return d.name;
    })
  }

  patternFrom(item: Note|string) {
    const note = toObject(item, toNote);
    if (!this.contains(note)) return new Pattern([]);
    var intervals = [];
    this.each(function(d) {
      intervals.push(new Interval(d.intervalFrom(note)));
    });
    intervals.sort(function(a,b) {
      return a.size - b.size;
    });
    intervals = intervals.map(function(d) {
      var name = d.name !== 'P1' ? d.name : 'R';
      return name;
    });
    return new Pattern(intervals);
  };

}

function toNote(string: string) {
  return new Note(string);
}

export default NoteCollection;
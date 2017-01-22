import _abc from './abc';
import {Circle} from './math';
import * as _circles from './circles';

import Key from './key';
import Note from './note';
import Chord from './chord';
import Interval from './interval';
import Pattern from './pattern';
import NoteCollection from './note-collection';


namespace motive {

  export const abc = _abc;

  export const key = function(keyInput) {
    return new Key(keyInput);
  };

  export const note = function(noteInput) {
    return new Note(noteInput);
  };

  export const chord = function(chordInput) {
    return new Chord(chordInput);
  };

  export const interval = function(intervalInput) {
    return new Interval(intervalInput);
  };

  export const pattern = function(patternInput) {
    return new Pattern(patternInput);
  };

  export const noteCollection = function(noteCollectionInput) {
    return new NoteCollection(noteCollectionInput);
  };

  export const circles = _circles;

  export const constructors = {
    Note: Note,
    Interval: Interval,
    Chord: Chord
  };
}

export default motive;
motive.abc = abc;

motive.key = function(keyInput) {
  return new Key(keyInput);
};

motive.note = function(noteInput) {
  return new Note(noteInput);
};

motive.chord = function(chordInput) {
  return new Chord(chordInput);
};

motive.interval = function(intervalInput) {
  return new Interval(intervalInput);
};

motive.pattern = function(patternInput) {
  return new Pattern(patternInput);
};

motive.noteCollection = function(noteCollectionInput) {
  return new NoteCollection(noteCollectionInput);
};

motive.circles = circles;

motive.constructors = {
  Note: Note,
  Interval: Interval,
  Chord: Chord
};

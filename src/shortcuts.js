motive.note = function(noteInput) {
  return new motive.Note(noteInput);
};

motive.chord = function(chordInput) {
  return new motive.Chord(chordInput);
};

motive.interval = function(intervalInput) {
  return new motive.Interval(intervalInput);
};

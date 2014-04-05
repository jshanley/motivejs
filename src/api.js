motive.abc = abc;

motive.note = function(noteInput) {
  return new Note(noteInput);
};

motive.chord = function(chordInput) {
  return new Chord(chordInput);
};

motive.interval = function(intervalInput) {
  return new Interval(intervalInput);
};

motive.circles = circles;

motive.constructors = {
	Note: Note,
	Interval: Interval,
	Chord: Chord
};

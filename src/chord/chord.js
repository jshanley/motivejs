motive.Chord = function(chord_name) {
  var parsed = regex.validate.chordName(chord_name).parse();
  if (!parsed) {
    throw new Error('Invalid chord name.');
  }
  var speciesIntervals = getSpeciesIntervals(parsed.species);

  var memberIntervals = palette.applyAlterations(speciesIntervals, parsed.alterations);

  this.name = chord_name;
  this.type = 'chord';
  this.root = new motive.Note(parsed.root);
  this.formula = parsed.species + parsed.alterations;
  this.isSlash = parsed.slash === '/' ? true : false;
  this.bass = this.isSlash ? new motive.Note(parsed.bass) : this.root;
  this.intervals = memberIntervals;
  this.notes = getChordNotes(this.intervals, this.root);
}

motive.Chord.prototype.transpose = function(direction, interval) {
  return new motive.Chord(utilities.transpose(this.root, direction, interval).name + this.formula);
};
motive.Chord.prototype.toString = function() {
  return '[chord ' + this.name + ']';
};

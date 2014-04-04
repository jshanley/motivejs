motive.Note = function(noteInput) {
  var name;
  if (typeof noteInput === 'string') {
    name = noteInput;
  } else if (typeof noteInput === 'number') {
    name = circles.pitchNames.atIndex(noteInput);
  } else {
    throw new TypeError('Note name must be a string or number.');
  }

  var parsed = regex.validate.noteName(name).parse();
  if (!parsed) {
    throw new Error('Invalid note name.');
  }

  this.name = name;
  this.type = 'note';
  this.pitchClass = circles.pitchNames.indexOf(parsed.step + parsed.accidental);

  this.parts = {
    step: parsed.step,
    accidental: parsed.accidental
  };

  if (parsed.octave !== null) {
    this.setOctave(parsed.octave);
  }

  return this;
}

// converts an input to note object if a string is given instead
var toNote = function(input) {
  if (typeof input === 'string') {
    return new motive.Note(input);
  } else {
    return input;
  }
};
motive.Note.prototype.setOctave = function(octave) {
  if (typeof octave !== 'number') {
    throw new TypeError('Octave must be a number.');
  }
  this.name = this.parts.step + this.parts.accidental;
  this.type = 'pitch';
  this.octave = octave;
  this.scientific = this.name + octave.toString(10);
  this.abc = notations.abc.scientificToAbc(this.scientific);
  this.midi = circles.pitchNames.indexOf(this.scientific);
  this.frequency = convert.mtof(this.midi);
};
motive.Note.prototype.isEquivalent = function(other) {
  other = toNote(other);
  if (this.name !== other.name) {
    return false;
  }
  if (this.type === 'pitch' && other.type === 'pitch' && this.octave !== other.octave) {
    return false;
  }
  return true;
};
motive.Note.prototype.isEnharmonic = function(other) {
  other = toNote(other);
  if (this.pitchClass !== other.pitchClass) {
    return false;
  }
  if (this.type === 'pitch' && other.type === 'pitch' && (Math.abs(this.midi - other.midi) > 11)) {
    return false;
  }
  return true;
};
motive.Note.prototype.transpose = function(direction, interval) {
  return new motive.Note(utilities.transpose(this.type === 'pitch' ? this.scientific : this.name, direction, interval));
};
motive.Note.prototype.intervalTo = function(note) {
  note = toNote(note);
  return circles.intervals.atIndex(circles.fifths.indexOf(note.name) - circles.fifths.indexOf(this.name));
};
motive.Note.prototype.intervalFrom = function(note) {
  note = toNote(note);
  return circles.intervals.atIndex(circles.fifths.indexOf(this.name) - circles.fifths.indexOf(note.name));
};
motive.Note.prototype.up = function(interval) {
  return this.transpose('up', interval);
};
motive.Note.prototype.down = function(interval) {
  return this.transpose('down', interval);
};
motive.Note.prototype.toString = function() {
  var name;
  if (this.type === 'note') {
    name = this.name;
  } else if (this.type === 'pitch'){
    name = this.scientific;
  }
  return '[note ' + name + ']';
};

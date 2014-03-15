var validate        = require('../regex/validation/note_name'),
    pitch_names     = require('../primitives/pitch_names'),
    fifths          = require('../primitives/fifths'),
    intervals       = require('../primitives/intervals'),
    mtof            = require('../convert/mtof'),
    scientificToAbc = require('../convert/notation/abc/scientific_to_abc'),
    transpose       = require('../utilities/transpose');

function Note(noteInput) {
  var name;
  if (typeof noteInput === 'string') {
    name = noteInput;
  } else if (typeof noteInput === 'number') {
    name = pitch_names.atIndex(noteInput);
  } else {
    throw new TypeError('Note name must be a string or number.');
  }

  var parsed = validate(name).parse();
  if (!parsed) {
    throw new Error('Invalid note name.');
  }

  this.name = name;
  this.type = 'note';
  this.pitchClass = pitch_names.indexOf(parsed.step + parsed.accidental);

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
    return new Note(input);
  } else {
    return input;
  }
};
Note.prototype.setOctave = function(octave) {
  if (typeof octave !== 'number') {
    throw new TypeError('Octave must be a number.');
  }
  this.name = this.parts.step + this.parts.accidental;
  this.type = 'pitch';
  this.octave = octave;
  this.scientific = this.name + octave.toString(10);
  this.abc = scientificToAbc(this.scientific);
  this.midi = pitch_names.indexOf(this.scientific);
  this.frequency = mtof(this.midi);
};
Note.prototype.isEquivalent = function(other) {
  other = toNote(other);
  if (this.name !== other.name) {
    return false;
  }
  if (this.type === 'pitch' && other.type === 'pitch' && this.octave !== other.octave) {
    return false;
  }
  return true;
};
Note.prototype.isEnharmonic = function(other) {
  other = toNote(other);
  if (this.pitchClass !== other.pitchClass) {
    return false;
  }
  if (this.type === 'pitch' && other.type === 'pitch' && (Math.abs(this.midi - other.midi) > 11)) {
    return false;
  }
  return true;
};
Note.prototype.transpose = function(direction, interval) {
  return new Note(transpose(this.type === 'pitch' ? this.scientific : this.name, direction, interval));
};
Note.prototype.intervalTo = function(note) {
  note = toNote(note);
  return intervals.atIndex(fifths.indexOf(note.name) - fifths.indexOf(this.name));
};
Note.prototype.intervalFrom = function(note) {
  note = toNote(note);
  return intervals.atIndex(fifths.indexOf(this.name) - fifths.indexOf(note.name));
};
Note.prototype.up = function(interval) {
  return this.transpose('up', interval);
};
Note.prototype.down = function(interval) {
  return this.transpose('down', interval);
};
Note.prototype.toString = function() {
  var name;
  if (this.type === 'note') {
    name = this.name;
  } else if (this.type === 'pitch'){
    name = this.scientific;
  }
  return '[note ' + name + ']';
};

module.exports = function(noteInput) {
  return new Note(noteInput);
};

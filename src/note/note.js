var validate        = require('../regex/validation/note_name'),
    pitch_names     = require('../primitives/pitch_names'),
    fifths          = require('../primitives/fifths'),
    intervals       = require('../primitives/intervals'),
    mtof            = require('../convert/mtof'),
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
  this.pitchClass = pitch_names.indexOf(parsed.step + parsed.accidental);

  this.parts = {
    step: parsed.step,
    accidental: parsed.accidental
  };

  if (parsed.octave !== null) {
    this.name = parsed.step + parsed.accidental;
    this.octave = parsed.octave;
    this.scientific = name;
    this.midi = pitch_names.indexOf(this.scientific);
    this.frequency = mtof(this.midi);
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

// checks if a note object has an octave defined on it
var octaveOn = function(obj) {
  if (typeof obj.octave === 'undefined' || obj.octave === null) {
    return false;
  }
  return true;
};

Note.prototype.isEquivalent = function(other) {
  other = toNote(other);
  if (this.name !== other.name) {
    return false;
  }
  if (octaveOn(this) && octaveOn(other) && (this.octave !== other.octave)) {
    return false;
  }
  return true;
};
Note.prototype.isEnharmonic = function(other) {
  other = toNote(other);
  if (this.pitchClass !== other.pitchClass) {
    return false;
  }
  if (octaveOn(this) && octaveOn(other) && (Math.abs(this.midi - other.midi) > 11)) {
    return false;
  }
  return true;
};
Note.prototype.setOctave = function(octave) {
  if (typeof octave !== 'number') {
    throw new TypeError('Octave must be a number.');
  }
  this.octave = octave;
  this.scientific = this.name + octave.toString(10);
  this.midi = pitch_names.indexOf(this.scientific);
  this.frequency = mtof(this.midi);
};
Note.prototype.transpose = function(direction, interval) {
  return new Note(transpose(octaveOn(this) ? this.scientific : this.name, direction, interval));
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
  return this.name;
};

module.exports = function(noteInput) {
  return new Note(noteInput);
};

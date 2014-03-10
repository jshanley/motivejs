var Circle              = require('../math/circle'),
    modulo              = require('../math/modulo'),
    accidentalToAlter   = require('../convert/accidental_to_alter'),
    validate            = require('../regex/validation/note_name');

var pitch_names = new Circle(['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B']);

pitch_names.indexOf = function(member) {
  var parsed = validate(member).parse();
  if (!parsed) {
    throw new Error('Invalid pitch name.');
  }
  var alter = accidentalToAlter(parsed.accidental);
  var step_index = this.array.indexOf(parsed.step);
  // return pitch class if no octave given
  if (parsed.octave === null) {
    return modulo.mod12(step_index + alter);
  }
  return step_index + alter + (this.size * (parsed.octave + 1));
};

pitch_names.atIndex = function(index) {
  var octave = Math.floor(index / this.size) - 1;
  var note_index = modulo.mod12(index);
  return this.array[note_index] + octave.toString(10);
};

module.exports = pitch_names;

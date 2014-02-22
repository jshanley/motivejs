var Circle = require('../math/circle'),
    modulo = require('../math/modulo'),
    alterToAccidental = require('../convert/alter_to_accidental'),
    accidentalToAlter = require('../convert/accidental_to_alter'),
    validation = require('../regex/note_name');

var pitch_names = new Circle(['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B']);

pitch_names.indexOf = function(member) {
    var parsed = validation.parse(member);
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
    var step_index = modulo.mod12(index);
    return this.array[step_index] + octave.toString(10);
}

module.exports = pitch_names;
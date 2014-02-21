var Circle              = require('../math/circle'),
    modulo              = require('../math/modulo'),
    alterToAccidental   = require('../convert/alter_to_accidental'),
    accidentalToAlter   = require('../convert/accidental_to_alter');

var fifths = new Circle(['F','C','G','D','A','E','B']);
fifths.indexOf = function(note_name) {
    var step = note_name[0],
        accidental = note_name.slice(1),
        alter = accidentalToAlter(accidental);
    var index = this.array.indexOf(step);
    index = index + (this.size * alter);
    return index;
};
fifths.atIndex = function(index) {
    var alter = Math.floor(index / this.array.length),
        accidental = alterToAccidental(alter);
    index = modulo.modulo(index, this.size);
    return this.array[index] + accidental;
};

module.exports = fifths;
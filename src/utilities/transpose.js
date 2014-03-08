var intervals    = require('../primitives/intervals'),
    fifths       = require('../primitives/fifths'),
    steps        = require('../primitives/steps'),
    validate_n   = require('../regex/validation/note_name'),
    validate_i   = require('../regex/validation/interval_name');

function transpose(note_name, direction, interval) {
    if (direction !== 'up' && direction !== 'down') {
        throw new Error('Transpose direction must be either "up" or "down".');
    }
    var parsed_n = validate_n(note_name).parse();
    if (!parsed_n) {
        throw new Error('Invalid note name.');
    }
    var parsed_i = validate_i(interval).parse();
    if (!parsed_i) {
        throw new Error('Invalid interval name.');
    }

    var factor = direction === 'up' ? 1 : -1;

    var new_note_name = fifths.atIndex(
      fifths.indexOf(parsed_n.step + parsed_n.accidental) +
      (factor * intervals.indexOf(interval))
    );

    // check if octave adjustment is needed
    if (parsed_n.octave === null) {
        return new_note_name;
    }
    
    // octave adjustment
    var new_octave = parsed_n.octave + (factor * Math.floor(parsed_i.size / 8));
    var normalized_steps = parsed_i.size > 7 ? (parsed_i.size % 7) - 1 : parsed_i.size - 1;
    if ((steps.indexOf(parsed_n.step) + normalized_steps) >= 7) {
        new_octave += factor;
    }
    return new_note_name + new_octave.toString(10);
}

module.exports = transpose;

var intervals    = require('../primitives/intervals'),
    fifths       = require('../primitives/fifths'),
    steps        = require('../primitives/steps'),
    n_validation = require('../regex/note_name'),
    i_validation = require('../regex/interval_name');

function transpose(note_name, direction, interval) {

    if (!n_validation.validate(note_name)) {
        throw new Error('Invalid note name.');
    }
    if (direction !== 'up' && direction !== 'down') {
        throw new Error('Transpose direction must be either "up" or "down".');
    }
    if (!i_validation.validate(interval)) {
        throw new Error('Invalid interval name.');
    }

    var factor = direction === 'up' ? 1 : -1;
    var n_parsed = n_validation.parse(note_name);

    var new_note_name = fifths.atIndex(fifths.indexOf(n_parsed.step + n_parsed.accidental) + (factor * intervals.indexOf(interval)));
    
    // check if octave adjustment is needed
    if (!n_parsed.octave) {
        return new_note_name;
    }
    // octave adjustment
    var i_parsed = i_validation.parse(interval);
    var new_octave = n_parsed.octave + (factor * Math.floor(i_parsed.size / 8));
    var normalized_steps = i_parsed.size > 7 ? (i_parsed.size % 7) - 1 : i_parsed.size - 1;
    if ((steps.indexOf(n_parsed.step) + normalized_steps) >= 7) {
        new_octave += factor;
    }
    return new_note_name + new_octave.toString(10);
}

module.exports = transpose;


var validate        = require('../regex/validation/abc_note_name'),
    alterToAccidental = require('../convert/alter_to_accidental'),
    note              = require('./note');

var accidentals = {
  '_': -1,
  '=': 0,
  '^': 1
};

var adjustments = {
  ',': -1,
  '\'': 1
};

module.exports = function(abcInput) {
  var parsed = validate(abcInput).parse();
  if (!parsed) {
    throw new Error('Invalid ABC note name.');
  }

  var step,
      alter = 0,
      accidental,
      octave;

  // if parsed step is a capital letter
  if (/[A-G]/.test(parsed.step)) {
    octave = 4;
  } else { // parsed step is lowercase
    octave = 5;
  }

  // get the total alter value of all accidentals present
  for (var c = 0; c < parsed.accidental.length; c++) {
    alter += accidentals[parsed.accidental[c]];
  }

  // for each comma or apostrophe adjustment, adjust the octave value
  for (var d = 0; d < parsed.adjustments.length; d++) {
    octave += adjustments[parsed.adjustments[d]];
  }

  step = parsed.step.toUpperCase();
  accidental = alterToAccidental(alter);

  return note(step + accidental + octave.toString(10));
};

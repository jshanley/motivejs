var validateInput = require('../../../regex/validation/abc_note_name'),
    validateOutput = require('../../../regex/validation/note_name'),
    alterToAccidental = require('../../alter_to_accidental');

// abc notation symbols
var accidentals = require('./symbols').accidentals,
    adjustments = require('./symbols').adjustments;

module.exports = function(abcInput) {
  var parsed = validateInput(abcInput).parse();
  if (!parsed) {
    throw new Error('Cannot convert ABC to scientific notation. Invalid ABC note name.');
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

  var output = step + accidental + octave.toString(10);
  if (!validateOutput(output).valid) {
    throw new Error('Something went wrong converting ABC to scientific notation. Output invalid.');
  }
  return output;
};

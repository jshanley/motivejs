var validateInput = require('../../../regex/validation/note_name'),
    validateOutput = require('../../../regex/validation/abc_note_name'),
    accidentalToAlter = require('../../accidental_to_alter');

module.exports = function(scientific) {
  var parsed = validateInput(scientific).parse();
  if (!parsed || parsed.octave === null) {
    throw new Error('Cannot convert scientific to ABC. Invalid scientific note name.');
  }

  var abc_accidental = '',
      abc_step,
      abc_octave = '';

  var alter = accidentalToAlter(parsed.accidental);

  // add abc accidental symbols until alter is consumed (alter === 0)
  while(alter < 0) {
    abc_accidental += '_';
    alter += 1;
  }
  while(alter > 0) {
    abc_accidental += '^';
    alter -= 1;
  }

  // step must be lowercase for octaves above 5
  // add apostrophes or commas to get abc_octave
  //   to the correct value
  var o = parsed.octave;
  if (o >= 5) {
    abc_step = parsed.step.toLowerCase();
    for( ; o > 5; o--) {
      abc_octave += '\'';
    }
  } else {
    abc_step = parsed.step.toUpperCase();
    for( ; o < 4; o++) {
      abc_octave += ',';
    }
  }

  var output = abc_accidental + abc_step + abc_octave;
  if (!validateOutput(output).valid) {
    throw new Error('Something went wrong converting scientific to ABC. Output invalid.');
  }
  return output;
};

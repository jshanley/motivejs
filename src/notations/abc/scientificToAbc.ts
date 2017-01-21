notations.abc.scientificToAbc = function(scientific) {
  var parsed = regex.validate.noteName(scientific).parse();
  if (!parsed || parsed.octave === null) {
    throw new Error('Cannot convert scientific to ABC. Invalid scientific note name.');
  }

  var abc_accidental = '',
      abc_step,
      abc_octave = '';

  var alter = convert.accidentalToAlter(parsed.accidental);

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
  if (!regex.validate.abcNoteName(output).valid) {
    throw new Error('Something went wrong converting scientific to ABC. Output invalid.');
  }
  return output;
};

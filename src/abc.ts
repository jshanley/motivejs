import Note from './note';
import {accidentalToAlter, alterToAccidental} from './convert';

import validateNoteName from './validators/note';
import validateAbcNoteName from './validators/abc-note';


function abc(abcInput: string): Note {
  var sci = abcToScientific(abcInput);
  return new Note(sci);
}

const accidentals = {
  "_": -1,
  "=": 0,
  "^": 1
};

// octave adjustments
const adjustments = {
  ",": -1,
  "'": 1
};

function abcToScientific(abcInput: string): string {
  var parsed = validateAbcNoteName(abcInput).parse();
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
  if (!validateNoteName(output).valid) {
    throw new Error('Something went wrong converting ABC to scientific notation. Output invalid.');
  }
  return output;
};

function scientificToAbc(scientific: string): string {
  var parsed = validateNoteName(scientific).parse();
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
  if (!validateAbcNoteName(output).valid) {
    throw new Error('Something went wrong converting scientific to ABC. Output invalid.');
  }
  return output;
};

export default abc;
export {
  abcToScientific,
  scientificToAbc
}
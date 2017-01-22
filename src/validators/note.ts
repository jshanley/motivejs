import {makeValidation} from '../regex';


function validateNoteName(noteName: string) {

  var noteRegex = /^([A-G])(b+|\#+|x+)?(\-?[0-9]+)?$/;

  return makeValidation('note', noteRegex, function(captures) {
    return {
      step: captures[1],
      accidental: captures[2] ? captures[2] : '',
      octave: captures[3] ? parseInt(captures[3], 10) : null
    };
  })(noteName);
};

export default validateNoteName;
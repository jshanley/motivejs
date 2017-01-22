import {makeValidation} from '../regex';


function validateAbcNoteName(abcNoteName: string) {
  var abcRegex = /((?:\_|\=|\^)*)([a-g]|[A-G])((?:\,|\')*)/;

  return makeValidation('abc-note', abcRegex, function(captures) {
    return {
      accidental: captures[1] ? captures[1] : '',
      step: captures[2],
      adjustments: captures[3] ? captures[3] : ''
    };
  })(abcNoteName);
};

export default validateAbcNoteName;
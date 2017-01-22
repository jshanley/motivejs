import {makeValidation} from '../regex';


function validateKeyName(keyName: string){

  var keyRegex = /^([A-G])(b+|\#+|x+)* ?(m|major|minor)?$/i;

  return makeValidation('key', keyRegex, function(captures){
    return {
      step: captures[1],
      accidental: captures[2] ? captures[2] : '',
      quality: captures[3] ? captures[3] : ''
    };
  })(keyName);
};

export default validateKeyName;
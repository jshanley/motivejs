import {makeValidation} from '../regex';


function validateIntervalName(intervalName: string) {

  var intervalRegex = /^(P|M|m|A+|d+)(\d+|U)$/;

  return makeValidation('interval', intervalRegex, function(captures){
    return {
      quality: captures[1],
      size: parseInt(captures[2], 10)
    };
  })(intervalName);
};

export default validateIntervalName

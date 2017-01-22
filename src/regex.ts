// this makes a validation function for a string type defined by 'name'
function makeValidation<T>(name: string, exp: RegExp, parser: (a: RegExpExecArray) => T) {
  return function(input: string) {
    if (typeof input !== 'string') {
      throw new TypeError('Cannot validate ' + name + '. Input must be a string.');
    }
    var validate = function() {
      return input.match(exp) ? true : false;
    };
    return {
      valid: validate(),
      parse: function(){
        if (!validate()) {
          return false;
        }
        var captures = exp.exec(input);
        return parser(captures);
      }
    };
  };
};

function splitStringByPattern(str: string, pattern: RegExp): string[] {
  var output: string[] = [];
  while(pattern.test(str)) {
    var thisMatch = str.match(pattern);
    output.push(thisMatch[0]);
    str = str.slice(thisMatch[0].length);
  }
  return output;
};

export {
  makeValidation,
  splitStringByPattern
};
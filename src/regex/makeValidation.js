// this makes a validation function for a string type defined by 'name'
regex.makeValidation = function(name, exp, parsing_function) {
  return function(input) {
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
        return parsing_function(captures);
      }
    };
  };
};

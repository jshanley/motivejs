regex.validate.keyName = function(key_name){

  var key_regex = /^([A-G])(b+|\#+|x+)* ?(m|major|minor)?$/i;

  return regex.makeValidation('key', key_regex, function(captures){
    return {
      step: captures[1],
      accidental: captures[2] ? captures[2] : '',
      quality: captures[3] ? captures[3] : ''
    };
  })(key_name);
};
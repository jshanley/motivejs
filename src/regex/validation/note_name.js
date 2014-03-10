var makeValidation = require('./validation_factory');

var validation = (function(){

  var note_regex = /^([A-G])(b+|\#+|x+)?(\-?[0-9]+)?$/;

  return makeValidation('note', note_regex, function(captures){
    return {
      step: captures[1],
      accidental: captures[2] ? captures[2] : '',
      octave: captures[3] ? parseInt(captures[3], 10) : null
    };
  });
})();

module.exports = function(note_name) {
  return validation(note_name);
};

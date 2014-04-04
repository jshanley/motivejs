regex.validate.noteName = function(note_name){

  var note_regex = /^([A-G])(b+|\#+|x+)?(\-?[0-9]+)?$/;

  return regex.makeValidation('note', note_regex, function(captures){
    return {
      step: captures[1],
      accidental: captures[2] ? captures[2] : '',
      octave: captures[3] ? parseInt(captures[3], 10) : null
    };
  })(note_name);
};

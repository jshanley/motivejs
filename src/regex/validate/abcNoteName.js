regex.validate.abcNoteName = function(abc_note_name) {
  var abc_regex = /((?:\_|\=|\^)*)([a-g]|[A-G])((?:\,|\')*)/;

  return regex.makeValidation('abc-note', abc_regex, function(captures) {
    return {
      accidental: captures[1] ? captures[1] : '',
      step: captures[2],
      adjustments: captures[3] ? captures[3] : ''
    };
  })(abc_note_name);
};

var makeValidation = require('./validation_factory');

var validation = (function() {
  var abc_regex = /((?:\_|\=|\^)*)([a-g]|[A-G])((?:\,|\')*)/;

  return makeValidation('abc-note', abc_regex, function(captures) {
    return {
      accidental: captures[1] ? captures[1] : '',
      step: captures[2],
      adjustments: captures[3] ? captures[3] : ''
    };
  });
})();

module.exports = function(abc_note_name) {
  return validation(abc_note_name);
};

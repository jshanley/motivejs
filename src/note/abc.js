var abcToScientific = require('../convert/notation/abc/abc_to_scientific'),
    note            = require('./note');

module.exports = function(abcInput) {
  return note(abcToScientific(abcInput));
};

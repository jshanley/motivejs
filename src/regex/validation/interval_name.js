var makeValidation = require('./validation_factory');

var validation = (function() {

  var interval_regex = /^(P|M|m|A+|d+)(\d+|U)$/;

  return makeValidation('interval', interval_regex, function(captures){
    return {
      quality: captures[1],
      size: parseInt(captures[2], 10)
    };
  });
})();

module.exports = function(interval_name) {
  return validation(interval_name);
};

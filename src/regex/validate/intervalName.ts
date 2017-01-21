regex.validate.intervalName = function(interval_name) {

  var interval_regex = /^(P|M|m|A+|d+)(\d+|U)$/;

  return regex.makeValidation('interval', interval_regex, function(captures){
    return {
      quality: captures[1],
      size: parseInt(captures[2], 10)
    };
  })(interval_name);
};

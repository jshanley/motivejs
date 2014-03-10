module.exports = function(str, pattern) {
  var output = [];
  while(pattern.test(str)) {
    var thisMatch = str.match(pattern);
    output.push(thisMatch[0]);
    str = str.slice(thisMatch[0].length);
  }
  return output;
};

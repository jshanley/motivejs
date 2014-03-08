module.exports = (function() {
  return function(interval_array, root) {
    var output = [];
    for (var i = 0; i < interval_array.length; i++) {
      if (interval_array[i] === 'R') {
        output.push(root);
      } else {
        output.push(root.transpose('up', interval_array[i]))
      }
    }
    return output;
  }
})();

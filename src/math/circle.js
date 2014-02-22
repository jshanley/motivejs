var modulo = require('./modulo').modulo;

var Circle = function(array) {
    this.array = array;
    this.size = array.length;
    return this;
};

// define functions for simple circular lookup
// most instances will override these functions
//   with custom accessors
Circle.prototype.indexOf = function(member) {
    return this.array.indexOf(member);
};
Circle.prototype.atIndex = function(index) {
    index = modulo(index, this.size);
    return this.array[index];
};

module.exports = Circle;
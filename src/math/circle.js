math.Circle = function(array) {
  this.array = array;
  this.size = array.length;
  return this;
};

// define functions for simple circular lookup
// most instances will override these functions
//   with custom accessors
math.Circle.prototype.indexOf = function(member) {
  return this.array.indexOf(member);
};
math.Circle.prototype.atIndex = function(index) {
  index = math.modulo(index, this.size);
  return this.array[index];
};

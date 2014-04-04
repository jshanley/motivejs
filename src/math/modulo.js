math.modulo = function(a, b) {
  if (a >= 0) {
    return a % b;
  } else {
    return ((a % b) + b) % b;
  }
};
math.mod7 = function(a) {
  return math.modulo(a, 7);
};
math.mod12 = function(a) {
  return math.modulo(a, 12);
};

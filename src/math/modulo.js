function modulo(a, b) {
  if (a >= 0) {
    return a % b;
  } else {
    return ((a % b) + b) % b;
  }
}
function mod7(a) {
  return modulo(a, 7);
}
function mod12(a) {
  return modulo(a, 12);
}

module.exports = {
  modulo: modulo,
  mod7: mod7,
  mod12: mod12
};

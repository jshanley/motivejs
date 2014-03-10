function alterToAccidental (alter) {
  if (typeof alter === 'undefined') {
    throw new Error('Cannot convert alter to accidental, none given.');
  }
  if (alter === 0 || alter === null) {
    return '';
  }
  var accidental = '';
  while (alter < 0) {
    accidental += 'b';
    alter += 1;
  }
  while (alter > 1) {
    accidental += 'x';
    alter += -2;
  }
  while (alter > 0) {
    accidental += '#';
    alter += -1;
  }
  return accidental;
}

module.exports = alterToAccidental;

var interval = require('../src/motive').interval;

exports['interval'] = function(test) {
  test.equal(interval('M2').semitones, 2);
  test.equal(interval('d5').quality, 'd');
  test.equal(interval('M7').semitones, 11);
  test.equal(interval('m9').octaves, 1);
  test.equal(interval('m2').octaves, 0);
  test.equal(interval('A4').species, 'P');
  test.equal(interval('m6').species, 'M');
  test.equal(interval('M9').size, 9);
  test.done();
};

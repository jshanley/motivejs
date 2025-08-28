var Interval = require('../').Interval;

exports['interval'] = function(test) {
  test.expect(9);
  test.ok(Interval);
  test.equal(new Interval('M2').semitones, 2);
  test.equal(new Interval('d5').quality, 'd');
  test.equal(new Interval('M7').semitones, 11);
  test.equal(new Interval('m9').octaves, 1);
  test.equal(new Interval('m2').octaves, 0);
  test.equal(new Interval('A4').species, 'P');
  test.equal(new Interval('m6').species, 'M');
  test.equal(new Interval('M9').size, 9);
  test.done();
};

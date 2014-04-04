var motive = require('../');

exports['interval'] = function(test) {
  test.expect(9);
  test.ok(motive.Interval);
  test.equal(new motive.Interval('M2').semitones, 2);
  test.equal(new motive.Interval('d5').quality, 'd');
  test.equal(new motive.Interval('M7').semitones, 11);
  test.equal(new motive.Interval('m9').octaves, 1);
  test.equal(new motive.Interval('m2').octaves, 0);
  test.equal(new motive.Interval('A4').species, 'P');
  test.equal(new motive.Interval('m6').species, 'M');
  test.equal(new motive.Interval('M9').size, 9);
  test.done();
};

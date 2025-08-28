var motive = require('../');

exports['motive'] = function(test) {
  test.expect(8);
  test.ok(motive);
  test.ok(motive.abc);
  test.ok(motive.Circle);
  test.ok(motive.circles);
  test.ok(motive.Key);
  test.ok(motive.Note);
  test.ok(motive.Chord);
  test.ok(motive.Interval);
  test.done();
};

var motive = require('../');

exports['motive'] = function(test) {
  test.expect(5);
  test.ok(motive);
  test.ok(motive.Note);
  test.ok(motive.abc);
  test.ok(motive.Chord);
  test.ok(motive.Interval);
  test.done();
};

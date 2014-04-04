var motive = require('../');

exports['motive'] = function(test) {
  test.expect(8);
  test.ok(motive);
  test.ok(motive.Note);
  test.ok(motive.note);
  test.ok(motive.abc);
  test.ok(motive.Chord);
  test.ok(motive.chord);
  test.ok(motive.Interval);
  test.ok(motive.interval);
  test.done();
};

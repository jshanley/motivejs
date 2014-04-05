var motive = require('../');

exports['motive'] = function(test) {
  test.expect(6);
  test.ok(motive);
  test.ok(motive.note);
  test.ok(motive.abc);
  test.ok(motive.chord);
  test.ok(motive.interval);
  test.ok(motive.constructors);
  test.done();
};

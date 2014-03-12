var motive = require('../src/motive');

exports['motive'] = function(test) {
  test.ok(motive.note);
  test.ok(motive.abc);
  test.ok(motive.chord);
  test.ok(motive.interval);
  test.ok(motive.palette);
  test.done();
};

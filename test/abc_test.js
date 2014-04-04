var abc = require('../').abc;

exports['abc'] = function(test) {
  test.expect(9);
  test.ok(abc);
  test.equals(abc('=A').name, 'A');
  test.equals(abc('C,,').octave, 2);
  test.equals(abc('^^G').name, 'Gx');
  test.equals(abc('__b\'\'').name, 'Bbb');
  test.equals(abc('__b\'\'').octave, 7);
  test.equals(abc("__b''").octave, 7);
  test.equals(abc("^F,',").octave, 3);
  test.equals(abc("^F,',").parts.accidental, '#');
  test.done();
};

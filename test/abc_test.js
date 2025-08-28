var abc = require('../').abc;
var Pitch = require('../').Pitch;

exports['abc'] = function(test) {
  test.expect(9);
  test.ok(abc);
  test.equals(new Pitch(abc('=A')).name, 'A');
  test.equals(new Pitch(abc('C,,')).octave, 2);
  test.equals(new Pitch(abc('^^G')).name, 'Gx');
  test.equals(new Pitch(abc('__b\'\'')).name, 'Bbb');
  test.equals(new Pitch(abc('__b\'\'')).octave, 7);
  test.equals(new Pitch(abc("__b''")).octave, 7);
  test.equals(new Pitch(abc("^F,',")).octave, 3);
  test.equals(new Pitch(abc("^F,',")).parts.accidental, '#');
  test.done();
};

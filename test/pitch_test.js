var Pitch = require('../').Pitch;

exports['pitch'] = function(test) {
  test.equal(new Pitch('G#4').name, 'G#');
  test.equal(new Pitch('Db6').octave, 6);
  test.equal(new Pitch('A4').midi, 69);
  test.equal(new Pitch('C5').midi, 72);
  test.equal(new Pitch('C4').isEnharmonic('B#3'), true);
  test.equal(new Pitch('C4').isEnharmonic('B#4'), false);
  test.equal(new Pitch(69).name, 'A');
  test.equal(new Pitch(70).octave, 4);
  test.done();
};
  
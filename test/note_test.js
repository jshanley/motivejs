var note = require('../').note;

exports['note'] = function(test) {
  test.equal(note('C').name, 'C');
  test.equal(note('D').pitchClass, 2);
  test.equal(note('Fb').isEnharmonic('E'), true);
  test.equal(note('Fb').isEnharmonic('E#'), false);
  test.equal(note('G').intervalFrom('C'), 'P5');
  test.equal(note('Bb').intervalTo('D'), 'M3');
  test.done();
};

exports['pitch'] = function(test) {
  test.equal(note('G#4').name, 'G#');
  test.equal(note('Db6').octave, 6);
  test.equal(note('A4').midi, 69);
  test.equal(note('C5').midi, 72);
  test.equal(note('Bbb').parts.accidental, 'bb');
  test.equal(note('Ab').parts.step, 'A');
  test.equal(note('C4').isEnharmonic('B#3'), true);
  test.equal(note('C4').isEnharmonic('B#4'), false);
  test.equal(note(69).name, 'A');
  test.equal(note(70).octave, 4);
  test.done();
};

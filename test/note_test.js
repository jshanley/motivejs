var Note = require('../').Note;

exports['note'] = function(test) {
  test.equal(new Note('C').name, 'C');
  test.equal(new Note('D').pitchClass, 2);
  test.equal(new Note('Fb').isEnharmonic('E'), true);
  test.equal(new Note('Fb').isEnharmonic('E#'), false);
  test.equal(new Note('G').intervalFrom('C'), 'P5');
  test.equal(new Note('Bb').intervalTo('D'), 'M3');
  test.done();
};

exports['pitch'] = function(test) {
  test.equal(new Note('G#4').name, 'G#');
  test.equal(new Note('Db6').octave, 6);
  test.equal(new Note('A4').midi, 69);
  test.equal(new Note('C5').midi, 72);
  test.equal(new Note('Bbb').parts.accidental, 'bb');
  test.equal(new Note('Ab').parts.step, 'A');
  test.equal(new Note('C4').isEnharmonic('B#3'), true);
  test.equal(new Note('C4').isEnharmonic('B#4'), false);
  test.equal(new Note(69).name, 'A');
  test.equal(new Note(70).octave, 4);
  test.done();
};

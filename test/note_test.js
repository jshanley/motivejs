var motive = require('../');

exports['note'] = function(test) {
  test.equal(new motive.Note('C').name, 'C');
  test.equal(new motive.Note('D').pitchClass, 2);
  test.equal(new motive.Note('Fb').isEnharmonic('E'), true);
  test.equal(new motive.Note('Fb').isEnharmonic('E#'), false);
  test.equal(new motive.Note('G').intervalFrom('C'), 'P5');
  test.equal(new motive.Note('Bb').intervalTo('D'), 'M3');
  test.done();
};

exports['pitch'] = function(test) {
  test.equal(new motive.Note('G#4').name, 'G#');
  test.equal(new motive.Note('Db6').octave, 6);
  test.equal(new motive.Note('A4').midi, 69);
  test.equal(new motive.Note('C5').midi, 72);
  test.equal(new motive.Note('Bbb').parts.accidental, 'bb');
  test.equal(new motive.Note('Ab').parts.step, 'A');
  test.equal(new motive.Note('C4').isEnharmonic('B#3'), true);
  test.equal(new motive.Note('C4').isEnharmonic('B#4'), false);
  test.equal(new motive.Note(69).name, 'A');
  test.equal(new motive.Note(70).octave, 4);
  test.done();
};

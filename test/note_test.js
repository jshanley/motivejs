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

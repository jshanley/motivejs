var motive = require('../');

exports['chord'] = function(test) {
  test.expect(4);
  test.ok(motive.Chord);
  test.equal(new motive.Chord('Dm7').root.name, 'D');
  test.equal(new motive.Chord('A7#9').notes.length, 5);
  test.equal(new motive.Chord('F#/A#').bass.name, 'A#');
  test.done();
};

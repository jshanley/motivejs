var Chord = require('../').Chord;

exports['chord'] = function(test) {
  test.expect(4);
  test.ok(Chord);
  test.equal(new Chord('Dm7').root.name, 'D');
  test.equal(new Chord('A7#9').notes.some(note => note.isEquivalent('C#')), true);
  test.equal(new Chord('F#/A#').bass.name, 'A#');
  test.done();
};

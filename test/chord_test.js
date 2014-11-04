var chord = require('../').chord;

exports['chord'] = function(test) {
  test.expect(4);
  test.ok(chord);
  test.equal(chord('Dm7').root.name, 'D');
  test.equal(chord('A7#9').notes.contains('C#'), true);
  test.equal(chord('F#/A#').bass.name, 'A#');
  test.done();
};

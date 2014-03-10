var chord = require('../src/motive').chord;

exports['chord'] = function(test) {
  test.equal(chord('Dm7').root.name, 'D');
  test.equal(chord('A7#9').notes.length, 5);
  test.equal(chord('F#/A#').bass.name, 'A#');
  test.done();
};

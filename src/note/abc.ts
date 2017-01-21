var abc = function(abcInput) {
  var sci = notations.abc.abcToScientific(abcInput);
  return new Note(sci);
}

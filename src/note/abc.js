motive.abc = function(abcInput) {
  var sci = notations.abc.abcToScientific(abcInput);
  return new motive.Note(sci);
}

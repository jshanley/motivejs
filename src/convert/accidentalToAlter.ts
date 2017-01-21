convert.accidentalToAlter = function(accidental) {
  if (!accidental) {
    return 0;
  }
var totalSymbolValue = 0;
  // look up the value of each symbol in the parsed accidental
  for (var a = 0; a < accidental.length; a++){
    totalSymbolValue += primitives.operators[accidental[a]];
  }
  // add the total value of the accidental to alter
  return totalSymbolValue;
};

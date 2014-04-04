circles.pitchNames = new math.Circle(['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B']);

circles.pitchNames.indexOf = function(member) {
  var parsed = regex.validate.noteName(member).parse();
  if (!parsed) {
    throw new Error('Invalid pitch name.');
  }
  var alter = convert.accidentalToAlter(parsed.accidental);
  var step_index = this.array.indexOf(parsed.step);
  // return pitch class if no octave given
  if (parsed.octave === null) {
    return math.mod12(step_index + alter);
  }
  return step_index + alter + (this.size * (parsed.octave + 1));
};

circles.pitchNames.atIndex = function(index) {
  var octave = Math.floor(index / this.size) - 1;
  var note_index = math.mod12(index);
  return this.array[note_index] + octave.toString(10);
};

circles.fifths = new math.Circle(['F','C','G','D','A','E','B']);
circles.fifths.indexOf = function(note_name) {
  var step = note_name[0],
      accidental = note_name.slice(1),
      alter = convert.accidentalToAlter(accidental);
  var index = this.array.indexOf(step);
  index = index + (this.size * alter);
  return index;
};
circles.fifths.atIndex = function(index) {
  var alter = Math.floor(index / this.array.length),
      accidental = convert.alterToAccidental(alter);
  index = math.modulo(index, this.size);
  return this.array[index] + accidental;
};

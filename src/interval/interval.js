var Interval = function(interval_name) {
  var parsed = regex.validate.intervalName(interval_name).parse();
  if (!parsed) {
    throw new Error('Invalid interval name.');
  }

  this.steps = parsed.size - 1;
  var normalizedSize = parsed.size > 7 ? (this.steps % 7) + 1 : parsed.size;

  this.name = interval_name;
  this.type = 'interval';
  this.quality = parsed.quality;
  this.size = parsed.size;
  this.normalized = this.quality + normalizedSize.toString(10);


  this.species = getIntervalSpecies(normalizedSize);

  // this is kinda ugly but it works...
  //   dividing by 7 evenly returns an extra octave if the value is a multiple of 7
  this.octaves = Math.floor(this.size / 7.001);

  this.semitones = getIntervalSemitones(this.quality, normalizedSize, this.octaves, this.species);

  return this;
};

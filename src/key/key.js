var Key = function(keyInput) {
  var parsed = regex.validate.keyName(keyInput).parse();
  if (!parsed) {
    throw new Error('Invalid key name: ' + keyInput.toString());
  }
  if (/[a-g]/.test(parsed.step) || parsed.quality === 'minor' || parsed.quality === 'm') {
    this.mode = 'minor';
  } else {
    this.mode = 'major';
  }
  // now that we have the mode, enforce uppercase
  parsed.step = parsed.step.toUpperCase();
  // get fifths for major key
  this.fifths = circles.fifths.indexOf(parsed.step + parsed.accidental);
  // minor is 3 fifths less than major
  if (this.mode === 'minor') {
    this.fifths -= 3;
    this.name = parsed.step.toLowerCase() + parsed.accidental + ' minor';
  } else {
    this.name = parsed.step + parsed.accidental + ' major';
  }
  return this;
}
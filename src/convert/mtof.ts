// midi to frequency (Hz)
convert.mtof = function(midi) {
  return Math.pow(2, ((midi - 69) / 12)) * 440;
};

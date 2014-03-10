// midi to frequency (Hz)
module.exports = function mtof(midi) {
  return Math.pow(2, ((midi - 69) / 12)) * 440;
};

// midi to frequency (Hz)
function mtof(midi) {
	return Math.pow(2, ((midi - 69) / 12)) * 440;
}

module.exports = mtof;
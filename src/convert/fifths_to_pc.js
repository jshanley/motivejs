var mod12 = require('../math/modulo').mod12;

function fifthsToPitchClass(fifths_index) {
	return mod12((fifths_index * 7) - 7);
}

module.exports = fifthsToPitchClass;
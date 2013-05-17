//PUBLIC API
var Motive = {
	version: '0.1.0',
	primitives: {
		pitch_classes: pitch_classes,
		steps: steps,
		operators: operators,
		keys: keys,
		intervals: intervals,
		scales: scales
	},
	transpose: transpose,
	random: {
		interval: getRandomInterval,
		pitch_class: getRandomPitchClass
	}
};
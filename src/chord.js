var validate = require('./regex/chord_name'),
	transpose = require('./utilities/transpose');

var chord = (function() {

	var chord_prototype = {
		name: 'Cm7',
		root: 'C',
		formula: 'm7',
		members: [],
		transpose: function(direction, interval) {
			var root = transpose(this.root, direction, interval);
			return chord(root + this.formula);
		},
		contains: function(member) {
			// need toNote function
			member = 'TODO';
		}
	};

	return function chord(chordInput) {
		var name = validate(chordInput).parse();
		if (!name) {
			throw new Error('Invalid chord name.');
		}

		var chordObj = Object.create(chord_prototype);

		// TODO

	};


})();
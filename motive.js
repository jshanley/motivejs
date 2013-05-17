(function() {
'use strict';
var pitch_classes = [
	{ value: 0,		natural: 'C',	flat: null,	sharp: 'B#',	dblflat: 'Dbb',	dblsharp: null,	common: 'C' },
	{ value: 1,		natural: null,	flat: 'Db',	sharp: 'C#',	dblflat: null,		dblsharp: 'Bx',	common: 'C#' },
	{ value: 2,		natural: 'D',	flat: null,	sharp: null,	dblflat: 'Ebb',	dblsharp: 'Cx',	common: 'D' },
	{ value: 3,		natural: null,	flat: 'Eb',	sharp: 'D#',	dblflat: 'Fbb',	dblsharp: null,	common: 'Eb' },
	{ value: 4,		natural: 'E',	flat: 'Fb',	sharp: null,	dblflat: null,		dblsharp: 'Dx',	common: 'E' },
	{ value: 5,		natural: 'F',	flat: null,	sharp: 'E#',	dblflat: 'Gbb',	dblsharp: null,	common: 'F' },
	{ value: 6,		natural: null,	flat: 'Gb',	sharp: 'F#',	dblflat: null,		dblsharp: 'Ex',	common: 'F#' },
	{ value: 7,		natural: 'G',	flat: null,	sharp: null,	dblflat: 'Abb',		dblsharp: 'Fx',	common: 'G' },
	{ value: 8,		natural: null,	flat: 'Ab',	sharp: 'G#',	dblflat: null,		dblsharp: null,	common: 'Ab' },
	{ value: 9,		natural: 'A',	flat: null,	sharp: null,	dblflat: 'Bbb',		dblsharp: 'Gx',	common: 'A' },
	{ value: 10,	natural: null,	flat: 'Bb',	sharp: 'A#',	dblflat: 'Cbb',		dblsharp: null,	common: 'Bb' },
	{ value: 11,	natural: 'B',	flat: 'Cb',	sharp: null,	dblflat: null,		dblsharp: 'Ax',	common: 'B' }
];
var steps = [
	{ name: 'C', value: 60 },
	{ name: 'D', value: 62 },
	{ name: 'E', value: 64 },
	{ name: 'F', value: 65 },
	{ name: 'G', value: 67 },
	{ name: 'A', value: 69 },
	{ name: 'B', value: 71 }
];
var operators = [
	{ name: 'b',	value: -1 },
	{ name: '#',	value: 1 },
	{ name: 'bb',	value: -2 },
	{ name: 'x',	value: 2 }
];
var keys = [
	{ fifths: 0,	major: 'C',	minor: 'A'	},
	{ fifths: 1,	major: 'G',	minor: 'E'	},
	{ fifths: -1,	major: 'F',	minor: 'D'	},
	{ fifths: 2,	major: 'D',	minor: 'B'	},
	{ fifths: -2,	major: 'Bb',	minor: 'G'	},
	{ fifths: 3,	major: 'A',	minor: 'F#' },
	{ fifths: -3,	major: 'Eb',	minor: 'C'	},
	{ fifths: 4,	major: 'E',	minor: 'C#' },
	{ fifths: -4,	major: 'Ab',	minor: 'F'	},
	{ fifths: 5,	major: 'B',	minor: 'G#' },
	{ fifths: -5,	major: 'Db',	minor: 'Bb' },
	{ fifths: 6,	major: 'F#',	minor: 'D#'	},
	{ fifths: -6,	major: 'Gb',	minor: 'Eb' },
	{ fifths: 7,	major: 'C#',	minor: 'A#'	},
	{ fifths: -7,	major: 'Cb',	minor: 'Ab'	}
];
var simple_intervals = [
	{ name: 'm2',	semitones: 1,	steps: 1 },
	{ name: 'M2',	semitones: 2,	steps: 1 },
	{ name: 'm3',	semitones: 3,	steps: 2 },
	{ name: 'M3',	semitones: 4,	steps: 2 },
	{ name: 'P4',	semitones: 5,	steps: 3 },
	{ name: 'A4',	semitones: 6,	steps: 3 },
	{ name: 'd5',	semitones: 6,	steps: 4 },
	{ name: 'P5',	semitones: 7,	steps: 4 },
	{ name: 'm6',	semitones: 8,	steps: 5 },
	{ name: 'M6',	semitones: 9,	steps: 5 },
	{ name: 'm7',	semitones: 10,	steps: 6 },
	{ name: 'M7',	semitones: 11,	steps: 6 }
];
var intervals = [
	{ name: 'U',	semitones: 0,	steps: 0 },
	{ name: 'm2',	semitones: 1,	steps: 1 },
	{ name: 'M2',	semitones: 2,	steps: 1 },
	{ name: 'A2',	semitones: 3,	steps: 1 },
	{ name: 'd3',	semitones: 2,	steps: 2 },
	{ name: 'm3',	semitones: 3,	steps: 2 },
	{ name: 'M3',	semitones: 4,	steps: 2 },
	{ name: 'd4',	semitones: 4,	steps: 3 },
	{ name: 'P4',	semitones: 5,	steps: 3 },
	{ name: 'A4',	semitones: 6,	steps: 3 },
	{ name: 'd5',	semitones: 6,	steps: 4 },
	{ name: 'P5',	semitones: 7,	steps: 4 },
	{ name: 'A5',	semitones: 8,	steps: 4 },
	{ name: 'm6',	semitones: 8,	steps: 5 },
	{ name: 'M6',	semitones: 9,	steps: 5 },
	{ name: 'A6',	semitones: 10,	steps: 5 },
	{ name: 'd7',	semitones: 9,	steps: 6 },
	{ name: 'm7',	semitones: 10,	steps: 6 },
	{ name: 'M7',	semitones: 11,	steps: 6 },
	{ name: 'P8',	semitones: 12,	steps: 7 },

	{ name: 'm9',	semitones: 13,	steps: 8 },
	{ name: 'M9',	semitones: 14,	steps: 8 },
	{ name: 'A9',	semitones: 15,	steps: 8 },
	{ name: 'd11',	semitones: 16,	steps: 10 },
	{ name: 'P11',	semitones: 17,	steps: 10 },
	{ name: 'A11',	semitones: 18,	steps: 10 },
	{ name: 'm13',	semitones: 20,	steps: 12 },
	{ name: 'M13',	semitones: 21,	steps: 12 },
	{ name: 'A13',	semitones: 22,	steps: 12 }
];
var scales = [
	{ name: 'major',		intervals: ['R','M2','M3','P4','P5','M6','M7'], pattern: [2,2,1,2,2,2,1] },
	{ name: 'minor',		intervals: ['R','M2','m3','P4','P5','m6','m7'], pattern: [2,1,2,2,1,2,2], source: ['major', 'up', 'm3'] },

	{ name: 'major pentatonic', intervals: ['R','M2','M3','P5','M6'], pattern: [2,2,3,2,3] },
	{ name: 'minor pentatonic', intervals: ['R','m3','P4','P5','m7'], pattern: [3,2,2,3,2], source: ['major pentatonic', 'up', 'm3'] },

	{ name: 'ionian',		intervals: ['R','M2','M3','P4','P5','M6','M7'], pattern: [2,2,1,2,2,2,1] },
	{ name: 'dorian',		intervals: ['R','M2','m3','P4','P5','M6','m7'], pattern: [2,1,2,2,2,1,2], source: ['major', 'down', 'M2'] },
	{ name: 'phrygian',	intervals: ['R','m2','m3','P4','P5','m6','m7'], pattern: [1,2,2,2,1,2,2], source: ['major', 'down', 'M3'] },
	{ name: 'lydian',		intervals: ['R','M2','M3','A4','P5','M6','M7'], pattern: [2,2,2,1,2,2,1], source: ['major', 'down', 'P4'] },
	{ name: 'mixolydian',	intervals: ['R','M2','M3','P4','P5','M6','m7'], pattern: [2,2,1,2,2,1,2], source: ['major', 'up', 'P4'] },
	{ name: 'aeolian',		intervals: ['R','M2','m3','P4','P5','m6','m7'], pattern: [2,1,2,2,1,2,2], source: ['major', 'up', 'm3'] },
	{ name: 'locrian',		intervals: ['R','m2','m3','P4','d5','m6','m7'], pattern: [1,2,2,1,2,2,2], source: ['major', 'up', 'm2'] },

	{ name: 'melodic minor',	intervals: ['R','M2','m3','P4','P5','M6','M7'], pattern: [2,1,2,2,2,2,1] },
	{ name: 'dorian b2',		intervals: ['R','m2','m3','P4','P5','M6','m7'], pattern: [1,2,2,2,2,1,2], source: ['melodic minor', 'down', 'M2'] },
	{ name: 'lydian #5',		intervals: ['R','M2','M3','A4','A5','M6','M7'], pattern: [2,2,2,2,1,2,1], source: ['melodic minor', 'down', 'm3'] },
	{ name: 'lydian dominant',	intervals: ['R','M2','M3','A4','P5','M6','m7'], pattern: [2,2,2,1,2,1,2], source: ['melodic minor', 'down', 'P4'] },
	{ name: 'mixolydian b6',	intervals: ['R','M2','M3','P4','P5','m6','m7'], pattern: [2,2,1,2,1,2,2], source: ['melodic minor', 'up', 'P4'] },
	{ name: 'aeolian b5',		intervals: ['R','M2','m3','P4','d5','m6','m7'], pattern: [2,1,2,1,2,2,2], source: ['melodic minor', 'up', 'm3'] },
	{ name: 'altered',			intervals: ['R','m2','m3','d4','d5','m6','m7'], pattern: [1,2,1,2,2,2,2], source: ['melodic minor', 'up', 'm2'] },

	{ name: 'harmonic minor',	intervals: ['R','M2','m3','P4','P5','m6','M7'], pattern: [2,1,2,2,1,3,1] },

	{ name: 'diminished', intervals: ['R','M2','m3','P4','d5','m6','M6','M7'], pattern: [2,1,2,1,2,1,2,1] },
	{ name: 'half-whole diminished', intervals: ['R','m2','m3','M3','A4','P5','M6','m7'], pattern: [1,2,1,2,1,2,1,2] },
	{ name: 'whole-half diminished', intervals: ['R','M2','m3','P4','d5','m6','M6','M7'], pattern: [2,1,2,1,2,1,2,1] },

	{ name: 'whole tone', intervals: ['R','M2','M3','A4','A5','m7'], pattern: [2,2,2,2,2,2] }
];
var tetrachords = [
	{ name: 'ionian',			pattern: [2,2,1] },
	{ name: 'dorian',			pattern: [2,1,2] },
	{ name: 'phrygian',		pattern: [1,2,2] },
	{ name: 'lydian',			pattern: [2,2,2] },
	{ name: 'hungarian major',	pattern: [3,1,2] },
	{ name: 'spanish phrygian', pattern: [1,2,1] },
	{ name: 'hungarian minor',	pattern: [2,1,3] },
	{ name: 'harmonic',		pattern: [1,3,1] }
];
var transpose = function(pitch_name, direction, interval){
	if(interval === 'U' || interval === 'R'){
		return pitch_name;
	}
	if (direction !== 'up' && direction !== 'down') {
		return pitch_name;
	}

	var step = pitch_name.replace(/([A-G]).*/, '$1');
	var input_operator = pitch_name.replace(/[A-G](.*)/, '$1');
	var alter = 0;
	if(input_operator) {
		for(var o = 0; o < operators.length; o++){
			if (input_operator === operators[o].name){
				alter = operators[o].value;
				break;
			}
		}
	}
	var step_index, input_value;
	for (var s = 0; s < steps.length; s++) {
		if (step === steps[s].name) {
			step_index = s;
			input_value = (steps[s].value + alter) % 12;
			break;
		}
	}
	var interval_value, interval_steps;
	for (var i = 0; i < intervals.length; i++) {
		if (interval === intervals[i].name) {
			interval_value = intervals[i].semitones;
			interval_steps = intervals[i].steps;
			break;
		}
	}
	var target_step_index, target_value;
	switch(direction){
		case 'up': {
			target_step_index = (step_index + interval_steps) % 7;
			target_value = (input_value + interval_value) % 12;
			break;
		}
		case 'down': {
			target_step_index = (7 + (step_index - interval_steps)) % 7;
			target_value = (12 + (input_value - interval_value)) % 12;
			break;
		}
	}
	if (target_value === (12 + steps[target_step_index].value) % 12) {
		return steps[target_step_index].name;
	} else {
		for (var op = 0; op < operators.length; op++) {
			if (target_value === (12 + steps[target_step_index].value + operators[op].value) % 12) {
				return steps[target_step_index].name + operators[op].name;
			}
		}
	}
};

var normalizeInterval = function(interval_name) {
	var output;
	if (interval_name.match(/13/)) {
		output = interval_name.replace(/13/, '6');
	} else if (interval_name.match(/11/)) {
		output = interval_name.replace(/11/, '4');
	} else if (interval_name.match(/9/)) {
		output = interval_name.replace(/9/, '2');
	}
	if (output) {
		return output;
	} else {
		return interval_name;
	}
};

var parseChordFormula = function(formula) {

	//the root is a given
	var interval_members = ['R'];

	//check quality of third
	//first make sure it's not a 5 chord or a sus chord
	if (formula !== '5' && !formula.match(/sus/)) {
		if (formula.match(/m(?:[1-9]|m)/) || formula.match(/min/) || formula.match(/dim/) || formula === 'm') {
			interval_members.push('m3');
		} else {
			interval_members.push('M3');
		}
	}
	//check for sus2 or sus4, unspecified sus will default to sus4
	if (formula.match(/sus2/)) {
		interval_members.push('M2');
	} else if (formula.match(/sus/)) {
		interval_members.push('P4');
	}
	//check for the rare #4, should usually be #11 but we'll play along
	if (formula.match(/(\+4|#4)/)) {
		interval_members.push('A4');
	}
	//check quality of fifth
	if (formula.match(/(\-5|b5)/) || formula.match(/dim/)) {
		interval_members.push('d5');
	} else if (formula.match(/(\+5|#5)/) || formula.match(/aug/)) {
		interval_members.push('A5');
	} else {
		interval_members.push('P5');
	}
	//sixth chords, all altered sixths must be spelled as 13ths, no playing along here
	if (formula === '6' || formula === 'm6' || formula === '6/9' || formula === 'm6/9') {
		interval_members.push('M6');
	}
	//check quality of seventh
	if (formula.match(/dim7/)) {
		interval_members.push('d7');
	} else if (formula.match(/(m7|min7)/)) {
		interval_members.push('m7');
	} else if (formula.match(/(maj7|maj9|maj11|maj13)/)) {
		interval_members.push('M7');
	} else if (formula.match(/(7|9|11|13)/) && formula !== '6/9' && formula !== 'm6/9') {
		interval_members.push('m7');
	}
	//check quality of ninth
	if (formula.match(/(\-9|b9)/)) {
		interval_members.push('m9');
	} else if (formula.match(/(\+9|#9)/)) {
		interval_members.push('A9');
	} else if (formula.match(/(9|11|13)/)) {
		interval_members.push('M9');
	}
	//check quality of eleventh
	if (formula.match(/(\-11|b11)/)) {
		interval_members.push('d11');
	} else if (formula.match(/(\+11|#11)/)) {
		interval_members.push('A11');
	} else if (formula.match(/(11|13)/)) {
		interval_members.push('P11');
	}
	//check quality of thirteenth
	if (formula.match(/(\-13|b13)/)) {
		interval_members.push('m13');
	} else if (formula.match(/(\+13|#13)/)) {
		interval_members.push('A13');
	} else if (formula.match(/13/)) {
		interval_members.push('M13');
	}
	return interval_members;
};

var getNoteNamesFromIntervalArray = function(root, interval_array) {
	try {
		var output = [];
		var notenames = [];
		for(var i = 0; i < interval_array.length; i++) {
			if (interval_array[i] === 'R') {
				notenames.push(root);
			} else {
				notenames.push(transpose(root, 'up', interval_array[i]));
			}
		}
		for(var n = 0; n < notenames.length; n++){
			output.push(notenames[n]);
		}
		return output;
	}
	catch(err) {
		console.log(err);
	}
};

var getRandomInterval = function(simple, normalized) {
	var output = {};
	var interval;
	var rnd;
	if (simple) {
		rnd = Math.floor(Math.random() * simple_intervals.length);
		interval = simple_intervals[rnd];
	} else {
		rnd = Math.floor(Math.random() * intervals.length);
		interval = intervals[rnd];
	}
	output.semitones = interval.semitones;
	output.steps = interval.steps;
	output.name = normalized ? normalizeInterval(interval.name) : interval.name;
	return output;
};

var getRandomPitchClass = function() {
	var output = {};
	var index = Math.floor(Math.random() * pitch_classes.length);
	output.value = pitch_classes[index].value;
	output.natural = pitch_classes[index].natural;
	output.flat = pitch_classes[index].flat;
	output.sharp = pitch_classes[index].sharp;
	output.dblflat = pitch_classes[index].dblflat;
	output.dblsharp = pitch_classes[index].dblsharp;
	output.common = pitch_classes[index].common;
	if (pitch_classes[index].natural) {
		output.name = pitch_classes[index].natural;
	} else {
		var spelling = Math.round(Math.random());
		if (spelling) {
			output.name = pitch_classes[index].flat;
		} else {
			output.name = pitch_classes[index].sharp;
		}
	}
	return output;
};
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
Motive.Note = function(name) {
	if (!name) {
		console.log('you must specify a note name or midi number');
		return;
	}
	switch (typeof name){
		case 'string': {
			try {
				var step = name.replace(/([A-G])(?:bb|x|b|#)?([0-9])?/g, '$1');
				if (!step) {
					console.log('Note name must begin with a capital letter [A-G].');
					return;
				}
				var operator = name.replace(/(?:[A-G])((?:bb|x|b|#)?)([0-9])?/g, '$1');
				var octave = parseInt(name.replace(/([A-G](?:bb|x|b|#)?)([0-9])?/g, '$2'), 10);
				if (octave){
					//octave was provided, treat as specific pitch
					var alter = 0;
					for (var o = 0; o < operators.length; o++){
						if (operators[o].name === operator){
							alter = operators[o].value;
							break;
						}
					}
					this.kind = 'pitch';
					this.octave = octave;
					this.step = step;
					this.accidental = operator;
					var midi;
					for (var s = 0; s < steps.length; s++){
						if (steps[s].name === step){
							midi = (12 * octave) + 12 + (steps[s].value % 12) + alter;
						}
					}
					if (midi) {
						var note_value = midi % 12;
						this.midi = midi;
						this.pitch_class = pitch_classes[note_value];
						this.frequency = (Math.pow(2,((midi - 69) / 12))) * 440;
					} else {
						console.log('could not calculate midi note number, check octave value');
						return;
					}
					this.pitch_name = step + operator;
					this.scientific = step + operator + octave;
				} else {
					//no octave provided, treat as pitch-class
					this.kind = 'pitch-class';
					this.step = step;
					this.accidental = operator;

					var step_value;
					for (var st = 0; st < steps.length; st++){
						if (steps[st].name === step){
							step_value = steps[st].value;
						}
					}
					var alter = 0;
					for (var op = 0; op < operators.length; op++){
						if (operators[op].name === operator){
							alter = operators[op].value;
							break;
						}
					}

					var note_value = (step_value + alter) % 12;

					this.pitch_class = pitch_classes[note_value];
					this.pitch_name = step + operator;
				}
			}
			catch(err){
				console.log(err);
			}
			break;
		}
		case 'number': {
			try {
				var note_value = name % 12,
					remains = name - note_value,
					octave = (remains / 12) - 1;
				var matched_pitch_class;
				for (var i = 0; i < pitch_classes.length; i++){
					if (pitch_classes[i].value === note_value){
						matched_pitch_class = pitch_classes[i];
						break;
					}
				}
				var assigned_name = matched_pitch_class.common;
				var step = assigned_name.replace(/([A-G])(?:bb|x|b|#)?/, '$1');
				var operator = assigned_name.replace(/(?:[A-G])((?:bb|x|b|#)?)/, '$1');

				this.pitch_class = matched_pitch_class;
				this.scientific = assigned_name + octave;
				this.midi = name;
				this.kind = 'pitch';
				this.step = step;
				this.accidental = operator;
				this.octave = octave;
				this.pitch_name = assigned_name;
				this.frequency = (Math.pow(2,((name - 69) / 12))) * 440;
			}
			catch(err) {
				console.log(err);
			}
			break;
		}
	}
	return this;
};

Motive.Note.prototype.transpose = function(direction, interval){
	switch(this.kind){
		case 'pitch-class': {
			var myname = this.pitch_name;
			var mynewname = transpose(myname, direction, interval);
			return new Motive.Note(mynewname);
			break;
		}
		case 'pitch': {
			var step_index;
			for (var i = 0; i < steps.length; i++){
				if (steps[i].name === this.step){
					step_index = i;
					break;
				}
			}
			var mynewname = transpose(this.pitch_name, direction, interval);
			var interval_steps;
			for (var i = 0; i < intervals.length; i++) {
				if (intervals[i].name === interval) {
					interval_steps = intervals[i].steps;
					break;
				}
			}
			var octave_change = 0;
			switch(direction){
				case 'up': {
					if ((step_index + interval_steps) >= (2 * steps.length)){
						octave_change = 2;
					} else if((step_index + interval_steps) >= steps.length){
						octave_change = 1;
					} else {
						octave_change = 0;
					}
					break;
				}
				case 'down': {
					if((step_index - interval_steps) < (0 - steps.length)){
						octave_change = -2;
					} else if ((step_index - interval_steps) < 0) {
						octave_change = -1;
					} else {
						octave_change = 0;
					}
					break;
				}
			}
			var newoctave = parseInt(this.octave, 10) + octave_change;
			return new Motive.Note(mynewname + newoctave.toString());
			break;
		}
	}
};
Motive.Chord = function(name){

	if (!name.match(/^([A-G](?:bb|x|b|#)?)(.*)/)) {
		console.log('invalid root');
	}

	var root = name.replace(/([A-G](?:bb|x|b|#)?)(.*)/g, '$1');
	var formula = name.replace(/([A-G](?:bb|x|b|#)?)(.*)/g, '$2');
	this.root = root;
	this.formula = formula;

	var interval_members = parseChordFormula(formula);

	var scale_members = [];
	for (var i = 0; i < interval_members.length; i++) {
		//push normalized interval
		scale_members.push(normalizeInterval(interval_members[i]));
	}

	var note_member_names = getNoteNamesFromIntervalArray(root, scale_members);

	var note_members = [];
	for (var n = 0; n < note_member_names.length; n++) {
		note_members.push(new Motive.Note(note_member_names[n]));
	}

	this.note_members = note_members;
	this.interval_members = interval_members;
	this.scale_members = scale_members;
	this.full_name = root + formula;

	return this;
};

Motive.Chord.prototype.transpose = function(direction, interval){
	var root = this.root;
	var newroot = transpose(root, direction, interval);
	return new Motive.Chord(newroot + this.formula);
};
Motive.Scale = function(name){
	if (!name) {
		console.log('no scale name specified');
		return;
	}
	if (typeof name === 'string') {

		var scale_pattern = /([A-G](?:bb|x|b|#)?)\s(.*)/;

		if (!name.match(scale_pattern)) {
			console.log('scale name was not formatted correctly');
			return;
		}

		var root = name.replace(scale_pattern, '$1');
		var formula = name.replace(scale_pattern, '$2');

		this.root = root;
		this.formula = formula;

		var matched;
		for(var i = 0; i < scales.length; i++){
			if(scales[i].name === formula){
				matched = scales[i];
				break;
			}
		}
		if(matched){
			this.matched = matched;
			var mynotes = getNoteNamesFromIntervalArray(root, matched.intervals);
			var note_members = [];
			for (var i = 0; i < mynotes.length; i++) {
				note_members.push(new Motive.Note(mynotes[i]));
			}
			this.note_members = note_members;
			this.interval_members = matched.intervals;
		} else {
			console.log('scale name did not match any known scales');
			return;
		}

		return this;

	} else {
		console.log('scale name must be a string');
		return;
	}
};
// if in nodejs, create a module
// otherwise, assume we are in a browser

if (module.exports) {
	module.exports = Motive;
} else {
	window.Motive = Motive;
}

})();
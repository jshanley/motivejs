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
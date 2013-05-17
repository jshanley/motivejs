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
(function(){function require(e,t){for(var n=[],r=e.split("/"),i,s,o=0;(s=r[o++])!=null;)".."==s?n.pop():"."!=s&&n.push(s);n=n.join("/"),o=require,s=o.m[t||0],i=s[n+".js"]||s[n+"/index.js"]||s[n],r='Cannot require("'+n+'")';if(!i)throw Error(r);if(s=i.c)i=o.m[t=s][e=i.m];if(!i)throw Error(r);return i.exports||i(i,i.exports={},function(n){return o("."!=n.charAt(0)?n:e+"/../"+n,t)}),i.exports};
require.m = [];
require.m[0] = { "src/convert/accidental_to_alter.js": function(module, exports, require){var operators = require('../primitives').operators;

function accidentalToAlter(accidental) {
    if (!accidental) {
        return 0;
    }
	var totalSymbolValue = 0;
    // look up the value of each symbol in the parsed accidental
    for (var a = 0; a < accidental.length; a++){
        totalSymbolValue += operators[accidental[a]];
    }
    // add the total value of the accidental to alter
    return totalSymbolValue;
}

module.exports = accidentalToAlter;},
"src/convert/alter_to_accidental.js": function(module, exports, require){function alterToAccidental (alter) {
	if (typeof(alter) === 'undefined') {
		MotiveError('Cannot convert alter to accidental, none given.');
	}
	if (alter === 0 || alter === null) {
		return '';
	}
	var accidental = '';
	while (alter < 0) {
		accidental += 'b';
		alter += 1;
	}
	while (alter > 1) {
		accidental += 'x';
		alter += -2;
	}
	while (alter > 0) {
		accidental += '#';
		alter += -1;
	}
	return accidental;
}

module.exports = alterToAccidental;},
"src/convert/midi_to_frequency.js": function(module, exports, require){function midiToFrequency(midi) {
	return Math.pow(2, ((midi - 69) / 12)) * 440;
}

module.exports = midiToFrequency;},
"src/convert/midi_to_note_name.js": function(module, exports, require){var modulo = require('../math/modulo');
var pitch_classes = require('../primitives').pitch_classes;

function midiToNoteName(midi) {
	var octave = ((midi - pc) / 12) - 1;
    var note_name = pitch_classes.get(midi);
    return note_name + octave.toString(10);
}

module.exports = midiToNoteName;},
"src/error.js": function(module, exports, require){function error(msg, fn, args) {
	console.log('Error:', {
		message: msg,
		sender: fn,
		arguments: args
	});
}

module.exports = error;},
"src/interval.js": function(module, exports, require){var parseIntervalName = require('./utilities/parse_interval_name');

function interval(intervalInput) {
    
    var intervalObj = Object.create(interval_prototype);
    
    var parsed = parseIntervalName(intervalInput);
    intervalObj.name        = parsed.name;
    intervalObj.quality     = parsed.quality;
    intervalObj.size        = parsed.size;
    intervalObj.steps       = parsed.steps;
    intervalObj.semitones   = parsed.semitones;
    intervalObj.octaves     = parsed.octaves;

    return intervalObj;
}

var interval_prototype = {
    name: 'PU',
    quality: 'P',
    size: 1,
    steps: 0,
    semitones: 0,
    octaves: 0
};

module.exports = interval;},
"src/math/circle.js": function(module, exports, require){var modulo = require('./modulo').modulo;

var Circle = function(array) {
	this.array = array;
	this.size = array.length;
	return this;
};

// define functions for simple circular lookup
// most instances will override these functions
//   with custom accessors
Circle.prototype.indexOf = function(member) {
	return this.array.indexOf(member);
};
Circle.prototype.atIndex = function(index) {
	index = modulo(index, this.size);
	return this.array[index];
};
/*
Circle.prototype.distance = function(from, to) {
	from = this.indexOf(from);
	to = this.indexOf(to);
	var clockwise = modulo(to - from, this.size),
		anticlockwise = modulo(from - to, this.size);
	result = {
		clockwise: clockwise,
		anticlockwise: anticlockwise,
		min: Math.min(clockwise, anticlockwise),
		crossingZero: from >= to ? 'clockwise' : 'anticlockwise'
	};

	return result;
};
*/
module.exports = Circle;},
"src/math/modulo.js": function(module, exports, require){function modulo(a, b) {
	if (a >= 0) {
		return a % b;
	} else {
		return ((a % b) + b) % b;
	}
}
function mod7(a) {
	return modulo(a, 7);
}
function mod12(a) {
	return modulo(a, 12);
}

module.exports = {
	modulo: modulo,
	mod7: mod7,
	mod12: mod12
};},
"src/motive.js": function(module, exports, require){var polyfills = require('./polyfills');

var note        = require('./note'),
    interval    = require('./interval');

module.exports = {
    note: note,
    interval: interval
};},
"src/note.js": function(module, exports, require){var error           = require('./error'),
    midiToNoteName  = require('./convert/midi_to_note_name'),
    midiToFrequency = require('./convert/midi_to_frequency'),
    parseNoteName   = require('./utilities/parse_note_name'),
    transpose       = require('./utilities/transpose');

var note = (function() {
    
    var note_prototype = {
        name : 'C',
        pitch_class : 0,
        transpose : function(direction, interval) {
            return note(transpose(this.scientific ? this.scientific : this.name, direction, interval));
        }
    };

    return function note(noteInput) {
        var name;
        if (typeof noteInput ==='string') {
            name = noteInput;
        } else if (typeof noteInput === 'number') {
            name = midiToNoteName(noteInput);
        } else {
            error('Note name must be a string or number.', note, arguments);
            return;
        }
        
        var noteObj = Object.create(note_prototype);
        
        noteObj.name = name;
        var parsed = parseNoteName(name);
        noteObj.pitch_class = parsed.pitch_class;

        noteObj.parts = {
            step: parsed.step,
            accidental: parsed.accidental,
            alter: parsed.alter
        };

        if (parsed.octave) {
            noteObj.name = parsed.step + parsed.accidental;
            noteObj.octave = parsed.octave;
            noteObj.scientific = noteObj.name + noteObj.octave.toString(10);
            noteObj.midi = (12 * (parsed.octave + 1)) + noteObj.pitch_class;
            noteObj.frequency = midiToFrequency(noteObj.midi);
        }
        
        return noteObj;
    };

})();

module.exports.note = note;
},
"src/polyfills.js": function(module, exports, require){// Object.create()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
if (typeof Object.create != 'function') {
    (function() {
        var F = function() {};
        Object.create = function(o) {
            if (arguments.length > 1) {
                throw Error('Second argument not supported');
            }
            if (o === null) {
                throw Error('Cannot set a null [[Prototype]]');
            }
            if (typeof o != 'object') {
                throw TypeError('Argument must be an object');
            }
            F.prototype = o;
            return new F();
        };
    })();
}

// Array.prototype.indexOf()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === undefined || this === null) {
            throw new TypeError('"this" is null or not defined');
        }

        var length = this.length >>> 0; // Hack to convert object.length to a UInt32

        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
        }

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        }

        for (; fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
                return fromIndex;
            }
        }

        return -1;
    };
}

module.exports = true;
},
"src/primitives.js": function(module, exports, require){var Circle = require('./math/circle');

var pitch_classes = new Circle(['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B']),
	steps = new Circle(['C','D','E','F','G','A','B']);

var operators = {
	'b': -1,
	'#': 1,
	'x': 2
};

module.exports = {
	pitch_classes: pitch_classes,
	steps: steps,
	operators: operators
};},
"src/primitives/fifths.js": function(module, exports, require){var Circle              = require('../math/circle'),
    modulo              = require('../math/modulo'),
    alterToAccidental   = require('../convert/alter_to_accidental'),
    accidentalToAlter   = require('../convert/accidental_to_alter');

var fifths = new Circle(['F','C','G','D','A','E','B']);
fifths.indexOf = function(note_name) {
    var step = note_name[0],
        accidental = note_name.slice(1),
        alter = accidentalToAlter(accidental);
    var index = this.array.indexOf(step);
    index = index + (this.size * alter);
    return index;
};
fifths.atIndex = function(index) {
    var alter = Math.floor(index / this.array.length),
        accidental = alterToAccidental(alter);
    index = modulo.modulo(index, this.size);
    return this.array[index] + accidental;
};

module.exports = fifths;},
"src/primitives/intervals.js": function(module, exports, require){var Circle              = require('../math/circle'),
    modulo              = require('../math/modulo'),
    error				= require('../error');

var intervals = new Circle([4,1,5,2,6,3,7]);
intervals.indexOf = function(interval_name) {

	var regex = /(P|M|m|A+|d+)(\d+)/;

	// captures will contain 3 strings:
	//   [0]: full interval 'm2'
	//   [1]: quality       'm'
	//   [2]: size           '2'
	var captures = regex.exec(interval_name);

	var quality = captures[1],
		size = captures[2];

	// make 'unison' into size 1
	size = size === 'U' ? 1 : parseInt(size, 10);

	// normalize large intervals
	size = size <= 7 ? size : modulo.modulo(size, this.size);

	// adjust by -1 since array starts with P4 which is index -1
	var size_index = this.array.indexOf(size) - 1;

	// now calculate the correct index value based on the interval quality and size
	var index,
		len_A,
		len_d;
	if (quality === 'P' || quality === 'M') {
		index = size_index;
	}
	else if (quality === 'm') {
		index = size_index - this.size;
	}
	else if (quality.match(/A+/)) {
		len_A = quality.match(/A+/)[0].length;
		index = size_index + (this.size * len_A);
	}
	else if (quality.match(/d+/)) {
		len_d = quality.match(/d+/)[0].length;
		if (size === 1 || size === 4 || size === 5) {
			index = size_index - (this.size * len_d);
		} else {
			index = size_index - (this.size + (this.size * len_d));
		}
	}
	return index;
};
intervals.atIndex = function(index) {

	// adjustment needed since array starts with P4 which is index -1
	var idx = index + 1;

	// factor represents the number of trips around the circle needed
	//   to get to index, and the sign represents the direction
	//   negative: anticlockwise, positive: clockwise
	var factor = Math.floor(idx / this.size);

	// mod by the size to normalize the index now that we know the factor
	idx = modulo.modulo(idx, this.size);

	// the size of the resultant interval is now known
	var size = this.array[idx].toString(10);

	// time to calculate the quality
	var quality = '';
	if (factor > 0) {
		for (var f = 0; f < factor; f += 1) {
			quality += 'A';
		}
	} else if (factor === 0) {
		quality = idx < 3 ? 'P' : 'M';
	} else if (factor === -1) {
		quality = idx < 3 ? 'd' : 'm';
	} else if (factor < -1) {
		for (var nf = -1; nf > factor; nf -= 1) {
			quality += 'd';
		}
		quality += idx < 3 ? 'd' : '';
	}
	return quality + size;
};

module.exports = intervals;},
"src/utilities/array_contains.js": function(module, exports, require){function arrayContains(array, test) {
	return array.indexOf(test) >= 0 ? true : false;
}

module.exports = arrayContains;},
"src/utilities/get_note_name.js": function(module, exports, require){var pitch_classes       = require('../primitives').pitch_classes,
    alterToAccidental   = require('../convert/alter_to_accidental');

// octave is optional, may be null, undefined, integer or string
function getNoteName(pitch_class, step, octave) {
    var note_name;
    // dummy may have the wrong step
    var dummy = pitch_classes.get(pitch_class);
    // if dummy has the right step, we're done
    if (dummy[0] === step) {
        note_name = dummy;
    } else {
        // otherwise calculate the correct name 
        var distance = pitch_classes.distance(step, dummy);
        var alter;
        if (distance.clockwise < distance.anticlockwise) {
            alter = distance.clockwise;
        } else {
            alter = -1 * distance.anticlockwise;
        }
        var accidental = alterToAccidental(alter);
        note_name = step + accidental;
    }

    if (octave) {
        note_name = note_name + octave.toString();
    }
    return note_name;
}

module.exports = getNoteName;},
"src/utilities/get_type.js": function(module, exports, require){// guess the type of an input based on its properties
function getType(input) {
	if (typeof input !== 'object') {
		return typeof input;
	}
	if (hasAllProperties(input, ['midi','name'])) {
		return 'note:pitch';
	}
	if (hasAllProperties(input, ['pitch_class','parts','name'])) {
		return 'note:pitch_class';
	}
	if (hasAllProperties(input, ['step','accidental','alter'])) {
		return 'note:parsed_name';
	}
	if (hasAllProperties(input, ['quality','size','steps','semitones','octaves'])) {
		return 'interval';
	}
	return 'unknown';
}

function hasAllProperties(obj, array) {
	for (var a = 0; a < array.length; a++) {
		if (!obj.hasOwnProperty(array[a])) {
			return false;
		}
	}
	return true;
}

module.exports = getType;},
"src/utilities/make_interval.js": function(module, exports, require){var error = require('../error');
var modulo = require('../math/modulo');
var arrayContains = require('./array_contains');


var makeInterval = (function(){

	// the intervals of the major scale, all major or perfect
	var major = [0,2,4,5,7,9,11];
	// the scale degrees which are perfect
	var perfects = [1,4,5];

	return function makeInterval(steps, semitones) {
		var size = steps + 1;
		var octaves = Math.floor(steps / 7);
		var normalized = {
			steps: modulo.mod7(steps),
			semitones: modulo.mod12(semitones)
		};

		// set 'perfect' to true only if the normalized interval is a perfectable 
		//   type: a unison, fourth, or fifth  
		var perfect = false;
		if (arrayContains(perfects, normalized.steps + 1)) {
			perfect = true;
		}

		// the difference in semitones between the target interval
		//   and the major-scale interval of the same size
		var difference = normalized.semitones - major[normalized.steps];

		if (difference > 1 || difference < -2) {
			error('No valid interval exists to satisfy input.', makeInterval, arguments);
			return;
		}

		var quality;
		switch(difference) {
			case 1:
				quality = 'A';
				break;
			case 0:
				quality = perfect ? 'P' : 'M';
				break;
			case -1:
				quality = perfect ? 'd' : 'm';
				break;
			case -2:
				if (perfect) {
					error('No valid interval exists to satisfy input.', makeInterval, arguments);
					return;
				}
				quality = 'd';
				break;
		}

		return quality + size.toString(10);
	};

})();

module.exports = makeInterval;},
"src/utilities/note_compare.js": function(module, exports, require){var getType = require('./get_type');
var toNote = require('./to_note');

function noteCompare(a, b) {

	a = toNote(a);
	b = toNote(b);

	var type_a = getType(a),
		type_b = getType(b);

	// do an exact comparison if they are both exact pitches
	if (type_a === 'note:pitch' && type_b === 'note:pitch') {
		var d_semitones = b.midi - a.midi;
		

	}



}},
"src/utilities/parse_interval_name.js": function(module, exports, require){var error = require('../error');
var modulo = require('../math/modulo');
var arrayContains = require('./array_contains');

var parseIntervalName = (function() {

    var interval_regex = /(P|M|m|A|d)([0-9]+|U)/;

    // the interval sizes that are 'perfectable'
    var perfects = [1,4,5];

    // ideal value represents semitones of Perfect or Major interval of size [index]
    //   first value [0] is just a placeholder since size 0 isn't used.
    //   explicitly: [null, P1, M2, M3, P4, P5, M6, M7, P8]
    var ideals = [0,0,2,4,5,7,9,11,12];

    // for each symbol, the values represent the alteration from  
    //   the 'ideal' value above, depending on whether
    //   interval is a perfectable type
    var symbols = {
        'P': { perfect: 0,       nonperfect: null },
        'M': { perfect: null,    nonperfect: 0    },
        'm': { perfect: null,    nonperfect: -1   },
        'A': { perfect: 1,       nonperfect: 1    },
        'd': { perfect: -1,      nonperfect: -2   }
    };

    return function parseIntervalName(interval_name) {

        if (interval_name === 'R' || interval_name === 'U') {
            return {
                name: 'PU',
                quality: 'P',
                size: 1,
                steps: 0,
                semitones: 0,
                octaves: 0
            };
        }

        // captures contains 3 strings:
        //   [0]: the full match
        //   [1]: interval quality
        //   [2]: interval size
        var captures = interval_regex.exec(interval_name);
        if (!captures) {
            error('Cannot parse interval name. Improper format.', parseIntervalName, arguments);
        }
        var quality = captures[1],
            size = captures[2] === 'U' ? 1 : parseInt(captures[2], 10),
            steps = size - 1;

        
        // number of octaves above normalization
        var octaves = 0;
        // normalized size = size for sizes < 8 (octave)
        var normalized_size = size;
        if (size >= 8) {
            octaves = Math.floor(size / 7);
            normalized_size = modulo.mod7(size);
        }
        var perfect = false;
        // check if normalized size is in 'perfects'
        if (arrayContains(perfects, normalized_size)) {
            perfect = true;
        }

        

        var semitones;
        if (perfect) {
            if (symbols[quality].perfect === null) {
                error('Invalid interval name.', parseIntervalName, arguments);
            }
            semitones = ideals[normalized_size] + symbols[quality].perfect;
        } else {
            if (symbols[quality].nonperfect === null) {
                error('Invalid interval name.', parseIntervalName, arguments);
            }
            semitones = ideals[normalized_size] + symbols[quality].nonperfect;
        }

        // re-adjust for large intervals
        semitones = semitones + (12 * octaves);

        return {
            name: interval_name,
            quality: quality,
            size: size,
            steps: steps,
            semitones: semitones,
            octaves: octaves
        };
    };
})();

module.exports = parseIntervalName;},
"src/utilities/parse_note_name.js": function(module, exports, require){var error               = require('../error'),
    pitch_classes       = require('../primitives').pitch_classes,
    accidentalToAlter   = require('../convert/accidental_to_alter'),
    modulo              = require('../math/modulo');

var parseNoteName = (function(){

    var note_regex = /^([A-G])(b+|\#+|x+)?(\-?[0-9]+)?$/;

    return function parseNoteName(note_name) {

        // 'captures' will contain 4 strings:
        //  [0] the full match
        //  [1] the first capture group: step
        //  [2] second capture group: accidental
        //  [3] third capture group: octave
        var captures = note_regex.exec(note_name);


        if (!captures) {
            error('Unable to parse note name. Invalid format.', parseNoteName, note_name);
            return;
        }

        var step = captures[1],
            accidental = captures[2] ? captures[2] : '',
            octave = captures[3] ? parseInt(captures[3], 10) : null;

        var step_value = pitch_classes.indexOf(step),
            alter = accidentalToAlter(accidental);

        var pitch_class = modulo.mod12(step_value + alter);

        // accidental and octave are optional
        return {
            name: note_name,
            step: step,
            accidental: accidental,
            alter: alter,
            octave: octave,
            pitch_class: pitch_class
        };
    };
})();

module.exports = parseNoteName;},
"src/utilities/to_interval.js": function(module, exports, require){var interval = require('../interval');
var getType = require('./get_type');

function toInterval(interval_name) {
	var type = getType(interval_name);
	if (type === 'interval') {
		return interval_name;
	}
	else {
		return interval(interval_name);
	}
}

module.exports = toInterval;},
"src/utilities/to_note.js": function(module, exports, require){var note = require('../note');
var getType = require('./get_type');

function toNote(note_name) {
	var type = getType(note_name);
	if (type === 'note:pitch' || type === 'note:pitch_class') {
		return note_name;
	}
	else {
		console.log(note);
		return note(note_name);
	}
}

module.exports = toNote;},
"src/utilities/transpose.js": function(module, exports, require){var error               = require('../error'),
    modulo              = require('../math/modulo'),
    toInterval          = require('./to_interval'),
    parseNoteName       = require('./parse_note_name'),
    fifths              = require('../primitives').fifths;

var transpose = (function(){

    return function transpose(note_name, direction, interval) {
        var note = parseNoteName(note_name);
        interval = toInterval(interval);
        if (direction !== 'up' && direction !== 'down') {
            error('No transposition direction specified.', transpose, arguments);
            return note_name;
        }
        // get sign from direction
        var factor = direction === 'up' ? 1 : -1;
        // convert direction to circular direction
        direction = factor > 0 ? 'clockwise' : 'anticlockwise';

        var new_pitch_class = modulo.mod12(note.pitch_class + (interval.semitones * factor));
        var new_step = steps.get(steps.indexOf(note.parts.step) + (interval.steps * factor));
        
        var octave_change = 0;
        var new_octave = null;
        if (note.octave) {
            // check if moving from the old step to the new step crosses 0 (C), which would
            //   change the octave by 1
            if (steps.distance(note.parts.step, new_step).crossingZero === direction) {
                octave_change += (1 + interval.octaves) * factor;
            } else {
                octave_change = interval.octaves * factor;
            }
            new_octave = note.octave + octave_change;
        }

        var new_note_name = getNoteName(new_pitch_class, new_step, new_octave);

        // if input was string, return as string
        //   otherwise make return a note object
        if (typeof(note_name) === 'string') {
            return new_note_name;
        } else {
            return toNote(new_note_name);
        }
    };
})();

module.exports = transpose;


}};
motive = require('src/motive.js');
}());
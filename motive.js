(function(){function require(e,t){for(var n=[],r=e.split("/"),i,s,o=0;(s=r[o++])!=null;)".."==s?n.pop():"."!=s&&n.push(s);n=n.join("/"),o=require,s=o.m[t||0],i=s[n+".js"]||s[n+"/index.js"]||s[n],r='Cannot require("'+n+'")';if(!i)throw Error(r);if(s=i.c)i=o.m[t=s][e=i.m];if(!i)throw Error(r);return i.exports||i(i,i.exports={},function(n){return o("."!=n.charAt(0)?n:e+"/../"+n,t)}),i.exports};
require.m = [];
require.m[0] = { "src/convert/accidental_to_alter.js": function(module, exports, require){var operators = require('../primitives/operators');

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
	if (typeof alter === 'undefined') {
		throw new Error('Cannot convert alter to accidental, none given.');
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
"src/convert/mtof.js": function(module, exports, require){// midi to frequency (Hz)
module.exports = function mtof(midi) {
	return Math.pow(2, ((midi - 69) / 12)) * 440;
}

},
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
"src/motive.js": function(module, exports, require){// load polyfills
require('./utilities/polyfills');

// load base modules
var note = require('./note');


// this will be the global object
module.exports = {
    note: note
};},
"src/note.js": function(module, exports, require){var validate        = require('./regex/note_name'),
    pitch_names     = require('./primitives/pitch_names'),
    mtof            = require('./convert/mtof'),
    transpose       = require('./utilities/transpose');

var note = (function() {

    // this function will ensure that input to a note method is another note object
    //   in case a string is given instead
    var toNote = function(input) {
        if (typeof input === 'string') {
            input = note(input);
        }
        if (typeof input !== 'object') {
            throw new TypeError('Input must be a note object or note name.');
        }
        return input;
    };

    // checks if a note object has an octave defined on it
    var octaveOn = function(obj) {
        if (typeof obj.octave === 'undefined' || obj.octave === null) {
            return false;
        }
        return true;
    };
    
    var note_prototype = {
        name : 'C',
        pitch_class : 0,
        isEquivalent: function(other) {
            other = toNote(other);
            if (this.name !== other.name) {
                return false;
            }
            if (octaveOn(this) && octaveOn(other) && (this.octave !== other.octave)) {
                return false;
            }
            return true;
        },
        isEnharmonic: function(other) {
            other = toNote(other);
            if (this.pitchClass !== other.pitchClass) {
                return false;
            }
            if (octaveOn(this) && octaveOn(other) && (Math.abs(this.midi - other.midi) > 11)) {
                return false;
            }
            return true;
        },
        setOctave: function(octave) {
            if (typeof octave !== 'number') {
                throw new TypeError('Octave must be a number.');
            }
            this.octave = octave;
            this.scientific = this.name + octave.toString(10);
            this.midi = pitch_names.indexOf(this.scientific);
            this.frequency = mtof(this.midi);
        },
        transpose : function(direction, interval) {
            return note(transpose(this.scientific ? this.scientific : this.name, direction, interval));
        },
        up: function(interval) {
            return this.transpose('up', interval);
        },
        down: function(interval) {
            return this.transpose('down', interval);
        }
    };

    return function note(noteInput) {
        var name;
        if (typeof noteInput ==='string') {
            name = noteInput;
        } else if (typeof noteInput === 'number') {
            name = pitch_names.atIndex(noteInput);
        } else {
            throw new TypeError('Note name must be a string or number.');
        }

        var parsed = validate(name).parse();
        if (!parsed) {
            throw new Error('Invalid note name.');
        }
        
        var noteObj = Object.create(note_prototype);
        
        noteObj.name = name;
        noteObj.pitchClass = pitch_names.indexOf(parsed.step + parsed.accidental);

        noteObj.parts = {
            step: parsed.step,
            accidental: parsed.accidental
        };

        if (parsed.octave !== null) {
            noteObj.name = parsed.step + parsed.accidental;
            noteObj.octave = parsed.octave;
            noteObj.scientific = name;
            noteObj.midi = pitch_names.indexOf(noteObj.scientific);
            noteObj.frequency = mtof(noteObj.midi);
        }
        
        return noteObj;
    };

})();

module.exports = note;
},
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
"src/primitives/intervals.js": function(module, exports, require){var Circle   = require('../math/circle'),
    modulo   = require('../math/modulo'),
    validate = require('../regex/interval_name');

var intervals = new Circle([4,1,5,2,6,3,7]);
intervals.indexOf = function(interval_name) {

    var parsed = validate(interval_name).parse();
    if (!parsed) {
        throw new Error('Invalid interval name.');
    }

    var quality = parsed.quality,
        size = parsed.size;

    // string to integer, make 'unison' into size 1
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
"src/primitives/operators.js": function(module, exports, require){module.exports = {
    'b': -1,
    '#': 1,
    'x': 2
};},
"src/primitives/pitch_names.js": function(module, exports, require){var Circle              = require('../math/circle'),
    modulo              = require('../math/modulo'),
    accidentalToAlter   = require('../convert/accidental_to_alter'),
    validate            = require('../regex/note_name');

var pitch_names = new Circle(['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B']);

pitch_names.indexOf = function(member) {
    var parsed = validate(member).parse();
    if (!parsed) {
        throw new Error('Invalid pitch name.');
    }
    var alter = accidentalToAlter(parsed.accidental);
    var step_index = this.array.indexOf(parsed.step);
    // return pitch class if no octave given
    if (parsed.octave === null) {
        return modulo.mod12(step_index + alter);
    }
    return step_index + alter + (this.size * (parsed.octave + 1));
};

pitch_names.atIndex = function(index) {
    var octave = Math.floor(index / this.size) - 1;
    var note_index = modulo.mod12(index);
    return this.array[note_index] + octave.toString(10);
};

module.exports = pitch_names;},
"src/primitives/steps.js": function(module, exports, require){module.exports = ['C','D','E','F','G','A','B'];},
"src/regex/chord_name.js": function(module, exports, require){var makeValidation = require('./validation_factory');

var validation = (function() {

    // lets split up this ugly regex
    var intro       = /^/,
        root_note   = /([A-G](?:b+|\#+|x+)?)/,
        species     = /((?:maj|sus|aug|dim|mmaj|m|\-)?(?:\d+)?(?:\/)?(?:\d)?)?/,
        alterations = /((?:(?:add|sus)(?:\d+)|(?:sus|alt)|(?:\#|\+|b|\-)(?:\d+))*)/,
        bass_slash  = /(\/)?/,
        bass_note   = /([A-G](?:b+|\#+|x+)?)?/,
        outro       = /$/;

    var chord_regex = new RegExp(
        intro.source +
        root_note.source +
        species.source +
        alterations.source +
        bass_slash.source +
        bass_note.source +
        outro.source
    );

    return makeValidation('chord', chord_regex, function(captures){
        return {
            root:           captures[1],
            species:        captures[2],
            alterations:    captures[3],
            slash:          captures[4],
            bass:           captures[5]
        };
    });

})();

module.exports = function(chord_name) {
    return validation(chord_name);
};
},
"src/regex/interval_name.js": function(module, exports, require){var makeValidation = require('./validation_factory');

var validation = (function() {
    
    var interval_regex = /^(P|M|m|A+|d+)(\d+|U)$/;
    
    return makeValidation('interval', interval_regex, function(captures){
        return {
            quality: captures[1],
            size: parseInt(captures[2], 10)
        };
    });
})();

module.exports = function(interval_name) {
    return validation(interval_name);
};},
"src/regex/note_name.js": function(module, exports, require){var makeValidation = require('./validation_factory');

var validation = (function(){
    
    var note_regex = /^([A-G])(b+|\#+|x+)?(\-?[0-9]+)?$/;
    
    return makeValidation('note', note_regex, function(captures){
        return {
            step: captures[1],
            accidental: captures[2] ? captures[2] : '',
            octave: captures[3] ? parseInt(captures[3], 10) : null
        };
    });
})();

module.exports = function(note_name) {
    return validation(note_name);
};},
"src/regex/validation_factory.js": function(module, exports, require){// this makes a validation function for a string type defined by 'name'
module.exports = function(name, regex, parsing_function) {
	return function(input) {
		if (typeof input !== 'string') {
			throw new TypeError('Cannot validate ' + name + '. Input must be a string.');
		}
		var validate = function() {
			return input.match(regex) ? true : false;
		};
		return {
			valid: validate(),
			parse: function(){
				if (!validate()) {
					return false;
				}
				var captures = regex.exec(input);
				return parsing_function(captures);
			}
		};
	};
};},
"src/utilities/polyfills.js": function(module, exports, require){// Object.create()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
if (typeof Object.create !== 'function') {
    (function() {
        var F = function() {};
        Object.create = function(o) {
            if (arguments.length > 1) {
                throw new Error('Second argument not supported');
            }
            if (o === null) {
                throw new Error('Cannot set a null [[Prototype]]');
            }
            if (typeof o !== 'object') {
                throw new TypeError('Argument must be an object');
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

// export true to allow checking that polyfills were loaded
module.exports = true;
},
"src/utilities/transpose.js": function(module, exports, require){var intervals    = require('../primitives/intervals'),
    fifths       = require('../primitives/fifths'),
    steps        = require('../primitives/steps'),
    validate_n   = require('../regex/note_name'),
    validate_i   = require('../regex/interval_name');

function transpose(note_name, direction, interval) {
    if (direction !== 'up' && direction !== 'down') {
        throw new Error('Transpose direction must be either "up" or "down".');
    }
    var parsed_n = validate_n(note_name).parse();
    if (!parsed_n) {
        throw new Error('Invalid note name.');
    }
    var parsed_i = validate_i(interval).parse();
    if (!parsed_i) {
        throw new Error('Invalid interval name.');
    }

    var factor = direction === 'up' ? 1 : -1;

    var new_note_name = fifths.atIndex(fifths.indexOf(parsed_n.step + parsed_n.accidental) + (factor * intervals.indexOf(interval)));
    
    // check if octave adjustment is needed
    if (parsed_n.octave === null) {
        return new_note_name;
    }
    // octave adjustment
    
    var new_octave = parsed_n.octave + (factor * Math.floor(parsed_i.size / 8));
    var normalized_steps = parsed_i.size > 7 ? (parsed_i.size % 7) - 1 : parsed_i.size - 1;
    if ((steps.indexOf(parsed_n.step) + normalized_steps) >= 7) {
        new_octave += factor;
    }
    return new_note_name + new_octave.toString(10);
}

module.exports = transpose;

}};
motive = require('src/motive.js');
}());
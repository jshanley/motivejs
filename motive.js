(function(){function require(e,t){for(var n=[],r=e.split("/"),i,s,o=0;(s=r[o++])!=null;)".."==s?n.pop():"."!=s&&n.push(s);n=n.join("/"),o=require,s=o.m[t||0],i=s[n+".js"]||s[n+"/index.js"]||s[n],r='Cannot require("'+n+'")';if(!i)throw Error(r);if(s=i.c)i=o.m[t=s][e=i.m];if(!i)throw Error(r);return i.exports||i(i,i.exports={},function(n){return o("."!=n.charAt(0)?n:e+"/../"+n,t)}),i.exports};
require.m = [];
require.m[0] = { "src/chord/get_species_intervals.js": function(module, exports, require){module.exports = (function(){

  var basic_types = {
    five: ['R','P5'],
    maj: ['R','M3','P5'],
    min: ['R','m3','P5'],
    aug: ['R','M3','A5'],
    dim: ['R','m3','d5'],
    sus2: ['R','M2','P5'],
    sus4: ['R','P4','P5']
  };

  var extensions = {
    nine: ['M9'],
    eleven: ['M9','P11'],
    thirteen: ['M9','P11','M13']
  };

  var species_regex = /^(maj|min|mmin|m|aug|dim|alt|sus|\-)?((?:\d+)|(?:6\/9))?$/;

  return function getSpeciesIntervals(species) {

    // easy stuff
    if (species in basic_types) {
      return basic_types[species];
    }
    if (species === '') {
      return basic_types.maj;
    }
    if (species === '5') {
      return basic_types.five;
    }
    if (species === 'm' || species === '-') {
      return basic_types.min;
    }
    if (species === 'sus') {
      return basic_types.sus4;
    }

    var output = [];

    var captures = species_regex.exec(species);

    var prefix = captures[1] ? captures[1] : '',
        degree = captures[2] ? captures[2] : '';

    switch (prefix) {
      case '':
        if (degree === '6/9') {
          output = output.concat(basic_types.maj, ['M6','M9']);
        } else {
          output = output.concat(basic_types.maj, degree === '6' ? 'M6' : 'm7');
        }
        break;
      case 'maj':
        output = output.concat(basic_types.maj, degree === '6' ? 'M6' : 'M7');
        break;
      case 'min':
      case 'm':
      case '-':
        output = output.concat(basic_types.min, degree === '6' ? 'M6' : 'm7');
        break;
      case 'aug':
        output = output.concat(basic_types.aug, degree === '6' ? 'M6' : 'm7');
        break;
      case 'dim':
        output = output.concat(basic_types.dim, 'd7');
        break;
      case 'mmaj':
        output = output.concat(basic_types.min, 'M7');
        break;
      default:
        break;
    }

    switch (degree) {
      case '9':
        output = output.concat(extensions.nine);
        break;
      case '11':
        output = output.concat(extensions.eleven);
        break;
      case '13':
        output = output.concat(extensions.thirteen);
        break;
      default:
        break;
    }
    return output;
  };

})();
},
"src/chord/jazz.js": function(module, exports, require){var validate                = require('../regex/validation/chord_name'),
    note                    = require('../note/note'),
    transpose               = require('../utilities/transpose'),
    getSpeciesIntervals     = require('./get_species_intervals'),
    applyAlterations        = require('../palette/apply_alterations'),
    getNotesFromIntervals   = require('../palette/get_notes_from_interval_array');


function JazzChord(chord_name) {
  var parsed = validate(chord_name).parse();
  if (!parsed) {
    throw new Error('Invalid chord name.');
  }
  var speciesIntervals = getSpeciesIntervals(parsed.species);

  var memberIntervals = applyAlterations(speciesIntervals, parsed.alterations);

  this.name = chord_name;
  this.type = 'chord';
  this.root = note(parsed.root);
  this.formula = parsed.species + parsed.alterations;
  this.isSlash = parsed.slash === '/' ? true : false;
  this.bass = this.isSlash ? note(parsed.bass) : this.root;
  this.intervals = memberIntervals;
  this.notes = getNotesFromIntervals(this.intervals, this.root);
}

JazzChord.prototype.transpose = function(direction, interval) {
  return new JazzChord(transpose(this.root, direction, interval).name + this.formula);
};

module.exports = function(chord_name) {
  return new JazzChord(chord_name);
};
},
"src/convert/accidental_to_alter.js": function(module, exports, require){var operators = require('../primitives/operators');

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

module.exports = accidentalToAlter;
},
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

module.exports = alterToAccidental;
},
"src/convert/mtof.js": function(module, exports, require){// midi to frequency (Hz)
module.exports = function mtof(midi) {
  return Math.pow(2, ((midi - 69) / 12)) * 440;
};
},
"src/interval/interval.js": function(module, exports, require){var validate = require('../regex/validation/interval_name');

// semitones from root of each note of the major scale
var major = [0,2,4,5,7,9,11];

function getSemitones(quality, normalizedSize, octaves, species) {
  // qualityInt represents the integer difference from a major or perfect quality interval
  //   for example, m3 will yield -1 since a minor 3rd is one semitone less than a major 3rd
  var qualityInt = 0;
  var q1 = quality.slice(0,1);
  switch (q1) {
    case 'P':
    case 'M':
      break;
    case 'm':
      qualityInt -=  1;
      break;
    case 'A':
      qualityInt += 1;
      break;
    case 'd':
      if (species === 'M') {
        qualityInt -= 2;
      } else {
        qualityInt -= 1;
      }
      break;
  }
  // handle additional augmentations or diminutions
  for (var q = 0; q < quality.slice(1).length; q++) {
    if (quality.slice(1)[q] === 'd') {
      qualityInt -= 1;
    } else if (quality.slice(1)[q] === 'A') {
      qualityInt += 1;
    }
  }

  return major[normalizedSize - 1] + qualityInt + (octaves * 12);
}

// 1,4,5 are treated differently than other interval sizes,
//   this helps to identify them immediately
function getSpecies(size) {
  if (size === 1 || size === 4 || size === 5) {
    return 'P';
  } else {
    return 'M';
  }
}

var Interval = function(interval_name) {
  var parsed = validate(interval_name).parse();
  if (!parsed) {
    throw new Error('Invalid interval name.');
  }

  this.steps = parsed.size - 1;
  var normalizedSize = parsed.size > 7 ? (this.steps % 7) + 1 : parsed.size;

  this.name = interval_name;
  this.type = 'interval';
  this.quality = parsed.quality;
  this.size = parsed.size;
  this.normalized = this.quality + normalizedSize.toString(10);


  this.species = getSpecies(normalizedSize);

  // this is kinda ugly but it works...
  //   dividing by 7 evenly returns an extra octave if the value is a multiple of 7
  var octaves = Math.floor(this.size / 7.001);

  this.semitones = getSemitones(this.quality, normalizedSize, octaves, this.species);

  return this;
};


module.exports = function(interval_name) {
  return new Interval(interval_name);
};
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

module.exports = Circle;
},
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
};
},
"src/motive.js": function(module, exports, require){// this will be the global object
module.exports = {
  note: require('./note/note'),
  chord: require('./chord/jazz'),
  interval: require('./interval/interval'),
  palette: require('./palette/palette')
};
},
"src/note/note.js": function(module, exports, require){var validate        = require('../regex/validation/note_name'),
    pitch_names     = require('../primitives/pitch_names'),
    fifths          = require('../primitives/fifths'),
    intervals       = require('../primitives/intervals'),
    mtof            = require('../convert/mtof'),
    transpose       = require('../utilities/transpose');

function Note(noteInput) {
  var name;
  if (typeof noteInput === 'string') {
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

  this.name = name;
  this.type = 'note';
  this.pitchClass = pitch_names.indexOf(parsed.step + parsed.accidental);

  this.parts = {
    step: parsed.step,
    accidental: parsed.accidental
  };

  if (parsed.octave !== null) {
    this.name = parsed.step + parsed.accidental;
    this.type = 'pitch';
    this.octave = parsed.octave;
    this.scientific = name;
    this.midi = pitch_names.indexOf(this.scientific);
    this.frequency = mtof(this.midi);
  }

  return this;
}

// converts an input to note object if a string is given instead
var toNote = function(input) {
  if (typeof input === 'string') {
    return new Note(input);
  } else {
    return input;
  }
};

Note.prototype.isEquivalent = function(other) {
  other = toNote(other);
  if (this.name !== other.name) {
    return false;
  }
  if (this.type === 'pitch' && other.type === 'pitch' && this.octave !== other.octave) {
    return false;
  }
  return true;
};
Note.prototype.isEnharmonic = function(other) {
  other = toNote(other);
  if (this.pitchClass !== other.pitchClass) {
    return false;
  }
  if (this.type === 'pitch' && other.type === 'pitch' && (Math.abs(this.midi - other.midi) > 11)) {
    return false;
  }
  return true;
};
Note.prototype.setOctave = function(octave) {
  if (typeof octave !== 'number') {
    throw new TypeError('Octave must be a number.');
  }
  this.octave = octave;
  this.scientific = this.name + octave.toString(10);
  this.midi = pitch_names.indexOf(this.scientific);
  this.frequency = mtof(this.midi);
  this.type = 'pitch';
};
Note.prototype.transpose = function(direction, interval) {
  return new Note(transpose(this.type === 'pitch' ? this.scientific : this.name, direction, interval));
};
Note.prototype.intervalTo = function(note) {
  note = toNote(note);
  return intervals.atIndex(fifths.indexOf(note.name) - fifths.indexOf(this.name));
};
Note.prototype.intervalFrom = function(note) {
  note = toNote(note);
  return intervals.atIndex(fifths.indexOf(this.name) - fifths.indexOf(note.name));
};
Note.prototype.up = function(interval) {
  return this.transpose('up', interval);
};
Note.prototype.down = function(interval) {
  return this.transpose('down', interval);
};
Note.prototype.toString = function() {
  return this.name;
};

module.exports = function(noteInput) {
  return new Note(noteInput);
};
},
"src/palette/apply_alterations.js": function(module, exports, require){var splitStringByPattern = require('../regex/split_string_by_pattern'),
    ParsedIntervalArray  = require('./parsed_interval_array');


module.exports = (function() {

  var alteration_regex = /^(?:(?:add|sus|no)(?:\d+)|(?:sus|alt)|(?:n|b|\#|\+|\-)(?:\d+))/;

  // applies to alterations of the form (operation)(degree) such as 'b5' or '#9'
  var toInterval = function(alteration) {
    var valid = /(?:n|b|\#|\+|\-)(?:\d+)/;
    if (!valid.test(alteration)) {
      return false;
    }
    var operation = alteration.slice(0,1);
    var degree = alteration.slice(1);
    if (operation === '+') { operation = '#'; }
    if (operation === '-') { operation = 'b'; }
    if (operation === '#') {
      return 'A' + degree;
    }
    if (operation === 'b') {
      if (degree === '5' || degree === '11' || degree === '4') {
        return 'd' + degree;
      } else {
        return 'm' + degree;
      }
    }
    if (operation === 'n') {
      if (degree === '5' || degree === '11' || degree === '4') {
        return 'P' + degree;
      } else {
        return 'M' + degree;
      }
    }
  };

/* might want this later
  var intervalType = function(parsed_interval) {
    if (parsed_interval.quality === 'P' || parsed_interval.quality === 'M') {
      return 'natural';
    } else {
      return 'altered';
    }
  };
*/
  var alterationType = function(alteration) {
    if (/sus/.test(alteration)) {
      return 'susX';
    }
    if (/add/.test(alteration)) {
      return 'addX';
    }
    if (/no/.test(alteration)) {
      return 'noX';
    }
    if (/alt/.test(alteration)) {
      return 'alt';
    }
    return 'binary';
  };



  function getNaturalInterval(size) {
    var normalized = size < 8 ? size : size % 7;
    if (normalized === 1 || normalized === 4 || normalized === 5) {
      return 'P' + size.toString(10);
    } else {
      return 'M' + size.toString(10);
    }
  }



  return function(interval_array, alterations) {
    var pia = new ParsedIntervalArray(interval_array);
    var alterationArray = splitStringByPattern(alterations, alteration_regex);
    // for each alteration...
    for (var a = 0; a < alterationArray.length; a++) {
      var thisAlteration = alterationArray[a];
      switch(alterationType(thisAlteration)) {
        case 'binary':
          var asInterval = toInterval(thisAlteration);
          pia.update(asInterval);
          break;
        case 'susX':
          pia.remove(3);
          pia.add('P4');
          break;
        case 'addX':
          var addition = parseInt(thisAlteration.slice(3), 10);
          pia.add(getNaturalInterval(addition));
          break;
        case 'noX':
          var removal = parseInt(thisAlteration.slice(2), 10);
          pia.remove(removal);
          break;
        case 'alt':
          pia.update('d5');
          pia.add('A5');
          pia.update('m9');
          pia.add('A9');
          pia.update('m13');
          break;
      }
    }

    return pia.unparse();
  };
})();
},
"src/palette/get_notes_from_interval_array.js": function(module, exports, require){module.exports = (function() {
  return function(interval_array, root) {
    var output = [];
    for (var i = 0; i < interval_array.length; i++) {
      if (interval_array[i] === 'R') {
        output.push(root);
      } else {
        output.push(root.transpose('up', interval_array[i]));
      }
    }
    return output;
  };
})();
},
"src/palette/palette.js": function(module, exports, require){function Palette(item) {
  this.notes = [];
  this.type = 'palette';
  if (typeof item !== 'undefined') {
    this.add(item);
  }
}
Palette.prototype.add = function(item) {
  if (item.type === 'note') {
    this.notes.push(item);
    return;
  }
  if (item.type === 'chord') {
    for (var i = 0; i < item.notes.length; i++) {
     var inThis = false;
     for (var t = 0; t < this.notes.length; t++) {
       if (this.notes[t].isEquivalent(item.notes[i])) {
         inThis = true;
         break;
       }
     }
     if (!inThis) {
       this.notes.push(item.notes[i]);
     }
    }
    return;
  }
};

module.exports = function(item) {
  return new Palette(item);
};
},
"src/palette/parsed_interval_array.js": function(module, exports, require){var validate = require('../regex/validation/interval_name');

function piaCompare(a,b) {
  var qualities = ['d','m','P','M','A'];
  if (a.size < b.size) {
    return -1;
  } else if (a.size > b.size) {
    return 1;
  } else {
    if (qualities.indexOf(a.quality) < qualities.indexOf(b.quality)) {
      return -1;
    } else if (qualities.indexOf(a.quality) > qualities.indexOf(b.quality)) {
      return 1;
    } else {
      return 0;
    }
  }
}

function ParsedIntervalArray(interval_array) {
  this.array = [];
  for (var i = 0; i < interval_array.length; i++) {
    if (interval_array[i] === 'R') {
      this.array.push({quality: 'P', size: 1});
    } else {
      this.array.push(validate(interval_array[i]).parse());
    }
  }
}

ParsedIntervalArray.prototype.sort = function() {
  return this.array.sort(piaCompare);
};
ParsedIntervalArray.prototype.add = function(interval) {
  var pInterval = validate(interval).parse();
  for (var i = 0; i < this.array.length; i++) {
    if (this.array[i].size === pInterval.size && this.array[i].quality === pInterval.quality) {
      return;
    }
  }
  this.array.push(pInterval);
  this.sort();
};
ParsedIntervalArray.prototype.remove = function(size) {
  // alias is the octave equivalent of size, for instance
  //   the alias of 2 is 9, alias of 13 is 6
  var alias = size <= 7 ? size + 7 : size - 7;
  var updated = [];
  // add all intervals that are not of the given size or its alias
  for (var i = 0; i < this.array.length; i++) {
    if (this.array[i].size !== size && this.array[i].size !== alias) {
      updated.push(this.array[i]);
    }
  }
  this.array = updated;
};
ParsedIntervalArray.prototype.update = function(interval) {
  var pInterval = validate(interval).parse();
  // remove any intervals of the same size
  this.remove(pInterval.size);
  // add the new interval
  this.array.push(pInterval);
  this.sort();
};
ParsedIntervalArray.prototype.unparse = function() {
  this.sort();
  var output = [];
  for (var i = 0; i < this.array.length; i++) {
    var str = this.array[i].quality + this.array[i].size;
    if (str === 'P1') {
      output.push('R');
    } else {
      output.push(str);
    }
  }
  return output;
};

module.exports = ParsedIntervalArray;
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

module.exports = fifths;
},
"src/primitives/intervals.js": function(module, exports, require){var Circle   = require('../math/circle'),
    modulo   = require('../math/modulo'),
    validate = require('../regex/validation/interval_name');

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

module.exports = intervals;
},
"src/primitives/operators.js": function(module, exports, require){module.exports = {
  'b': -1,
  '#': 1,
  'x': 2
};
},
"src/primitives/pitch_names.js": function(module, exports, require){var Circle              = require('../math/circle'),
    modulo              = require('../math/modulo'),
    accidentalToAlter   = require('../convert/accidental_to_alter'),
    validate            = require('../regex/validation/note_name');

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

module.exports = pitch_names;
},
"src/primitives/steps.js": function(module, exports, require){module.exports = ['C','D','E','F','G','A','B'];},
"src/regex/split_string_by_pattern.js": function(module, exports, require){module.exports = function(str, pattern) {
  var output = [];
  while(pattern.test(str)) {
    var thisMatch = str.match(pattern);
    output.push(thisMatch[0]);
    str = str.slice(thisMatch[0].length);
  }
  return output;
};
},
"src/regex/validation/chord_name.js": function(module, exports, require){var makeValidation = require('./validation_factory');

var validation = (function() {

  // lets split up this ugly regex
  var intro       = /^/,
      root_note   = /([A-G](?:b+|\#+|x+)?)/,
      species     = /((?:maj|min|sus|aug|dim|mmaj|m|\-)?(?:\d+)?(?:\/\d+)?)?/,
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
      root:         captures[1],
      species:      captures[2] ? captures[2] : '',
      alterations:  captures[3] ? captures[3] : '',
      slash:        captures[4] ? captures[4] : '',
      bass:         captures[5] ? captures[5] : ''
    };
  });

})();

module.exports = function(chord_name) {
  return validation(chord_name);
};
},
"src/regex/validation/interval_name.js": function(module, exports, require){var makeValidation = require('./validation_factory');

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
};
},
"src/regex/validation/note_name.js": function(module, exports, require){var makeValidation = require('./validation_factory');

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
};
},
"src/regex/validation/validation_factory.js": function(module, exports, require){// this makes a validation function for a string type defined by 'name'
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
};
},
"src/utilities/to_object.js": function(module, exports, require){// ensures that a function requiring a note (or similar type of) object as input
//   gets an object rather than a string representation of it.
//   'obj' will be the function used to create the object.
module.exports = function(input, obj) {
  if (typeof input === 'string') {
    input = obj(input);
  }
  if (typeof input !== 'object') {
    throw new TypeError('Input must be an object or string.');
  }
  return input;
};
},
"src/utilities/transpose.js": function(module, exports, require){var intervals    = require('../primitives/intervals'),
    fifths       = require('../primitives/fifths'),
    steps        = require('../primitives/steps'),
    validate_n   = require('../regex/validation/note_name'),
    validate_i   = require('../regex/validation/interval_name');

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

  var new_note_name = fifths.atIndex(
    fifths.indexOf(parsed_n.step + parsed_n.accidental) +
    (factor * intervals.indexOf(interval))
  );

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
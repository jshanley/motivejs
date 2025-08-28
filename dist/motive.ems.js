var operators = {
    'b': -1,
    '#': 1,
    'x': 2
};
var steps = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function accidentalToAlter(accidental) {
    if (!accidental) {
        return 0;
    }
    var totalSymbolValue = 0;
    // look up the value of each symbol in the parsed accidental
    for (var a = 0; a < accidental.length; a++) {
        totalSymbolValue += operators[accidental[a]];
    }
    // add the total value of the accidental to alter
    return totalSymbolValue;
}
function alterToAccidental(alter) {
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
function mtof(midi) {
    return Math.pow(2, ((midi - 69) / 12)) * 440;
}

// this makes a validation function for a string type defined by 'name'
function makeValidation(name, exp, parser) {
    return function (input) {
        if (typeof input !== 'string') {
            throw new TypeError('Cannot validate ' + name + '. Input must be a string.');
        }
        var validate = function () {
            return input.match(exp) ? true : false;
        };
        return {
            valid: validate(),
            parse: function () {
                if (!validate()) {
                    return false;
                }
                var captures = exp.exec(input);
                return parser(captures);
            }
        };
    };
}
function splitStringByPattern(str, pattern) {
    var output = [];
    while (pattern.test(str)) {
        var thisMatch = str.match(pattern);
        output.push(thisMatch[0]);
        str = str.slice(thisMatch[0].length);
    }
    return output;
}

function validateNoteName(noteName) {
    var noteRegex = /^([A-G])(b+|\#+|x+)?(\-?[0-9]+)?$/;
    return makeValidation('note', noteRegex, function (captures) {
        return {
            step: captures[1],
            accidental: captures[2] ? captures[2] : '',
            octave: captures[3] ? parseInt(captures[3], 10) : null
        };
    })(noteName);
}

function validateAbcNoteName(abcNoteName) {
    var abcRegex = /((?:\_|\=|\^)*)([a-g]|[A-G])((?:\,|\')*)/;
    return makeValidation('abc-note', abcRegex, function (captures) {
        return {
            accidental: captures[1] ? captures[1] : '',
            step: captures[2],
            adjustments: captures[3] ? captures[3] : ''
        };
    })(abcNoteName);
}

function abc(abcInput) {
    var sci = abcToScientific(abcInput);
    return sci;
}
var accidentals = {
    "_": -1,
    "=": 0,
    "^": 1
};
// octave adjustments
var adjustments = {
    ",": -1,
    "'": 1
};
function abcToScientific(abcInput) {
    var parsed = validateAbcNoteName(abcInput).parse();
    if (!parsed) {
        throw new Error('Cannot convert ABC to scientific notation. Invalid ABC note name.');
    }
    var step, alter = 0, accidental, octave;
    // if parsed step is a capital letter
    if (/[A-G]/.test(parsed.step)) {
        octave = 4;
    }
    else { // parsed step is lowercase
        octave = 5;
    }
    // get the total alter value of all accidentals present
    for (var c = 0; c < parsed.accidental.length; c++) {
        alter += accidentals[parsed.accidental[c]];
    }
    // for each comma or apostrophe adjustment, adjust the octave value
    for (var d = 0; d < parsed.adjustments.length; d++) {
        octave += adjustments[parsed.adjustments[d]];
    }
    step = parsed.step.toUpperCase();
    accidental = alterToAccidental(alter);
    var output = step + accidental + octave.toString(10);
    if (!validateNoteName(output).valid) {
        throw new Error('Something went wrong converting ABC to scientific notation. Output invalid.');
    }
    return output;
}
function scientificToAbc(scientific) {
    var parsed = validateNoteName(scientific).parse();
    if (!parsed || parsed.octave === null) {
        throw new Error('Cannot convert scientific to ABC. Invalid scientific note name.');
    }
    var abc_accidental = '', abc_step, abc_octave = '';
    var alter = accidentalToAlter(parsed.accidental);
    // add abc accidental symbols until alter is consumed (alter === 0)
    while (alter < 0) {
        abc_accidental += '_';
        alter += 1;
    }
    while (alter > 0) {
        abc_accidental += '^';
        alter -= 1;
    }
    // step must be lowercase for octaves above 5
    // add apostrophes or commas to get abc_octave
    //   to the correct value
    var o = parsed.octave;
    if (o >= 5) {
        abc_step = parsed.step.toLowerCase();
        for (; o > 5; o--) {
            abc_octave += '\'';
        }
    }
    else {
        abc_step = parsed.step.toUpperCase();
        for (; o < 4; o++) {
            abc_octave += ',';
        }
    }
    var output = abc_accidental + abc_step + abc_octave;
    if (!validateAbcNoteName(output).valid) {
        throw new Error('Something went wrong converting scientific to ABC. Output invalid.');
    }
    return output;
}

var Circle = /** @class */ (function () {
    function Circle(array) {
        this.array = array;
        this.size = array.length;
    }
    // define functions for simple circular lookup
    // most instances will override these functions
    //   with custom accessors
    Circle.prototype.indexOf = function (item) {
        return this.array.indexOf(item);
    };
    Circle.prototype.atIndex = function (index) {
        return this.array[modulo(index, this.size)];
    };
    return Circle;
}());
function modulo(a, b) {
    if (a >= 0) {
        return a % b;
    }
    else {
        return ((a % b) + b) % b;
    }
}
function mod12(a) {
    return modulo(a, 12);
}

function validateIntervalName(intervalName) {
    var intervalRegex = /^(P|M|m|A+|d+)(\d+|U)$/;
    return makeValidation('interval', intervalRegex, function (captures) {
        return {
            quality: captures[1],
            size: parseInt(captures[2], 10)
        };
    })(intervalName);
}

var fifths = new Circle(['F', 'C', 'G', 'D', 'A', 'E', 'B']);
fifths.indexOf = function (noteName) {
    var step = noteName[0], accidental = noteName.slice(1), alter = accidentalToAlter(accidental);
    var index = this.array.indexOf(step);
    index = index + (this.size * alter);
    return index - 1;
};
fifths.atIndex = function (index) {
    index = index + 1;
    var alter = Math.floor(index / this.array.length), accidental = alterToAccidental(alter);
    index = modulo(index, this.size);
    return this.array[index] + accidental;
};
// these values represent the size of intervals arranged by fifths.
// Given 4, each value is value[i] = mod7(value[i-1] + 4) with
//   the exception that zero is avoided by setting mod7(7) = 7
var intervals = new Circle([4, 1, 5, 2, 6, 3, 7]);
intervals.indexOf = function (intervalName) {
    var parsed = validateIntervalName(intervalName).parse();
    if (!parsed) {
        throw new Error('Invalid interval name.');
    }
    var quality = parsed.quality, size = parsed.size;
    // string to integer, make 'unison' into size 1
    // size = size === 'U' ? 1 : parseInt(size, 10);
    // normalize large intervals
    size = size <= 7 ? size : modulo(size, this.size);
    // adjust by -1 since array starts with P4 which is index -1
    var size_index = this.array.indexOf(size) - 1;
    // now calculate the correct index value based on the interval quality and size
    var index, len_A, len_d;
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
        }
        else {
            index = size_index - (this.size + (this.size * len_d));
        }
    }
    return index;
};
intervals.atIndex = function (index) {
    // adjustment needed since array starts with P4 which is index -1
    var idx = index + 1;
    // factor represents the number of trips around the circle needed
    //   to get to index, and the sign represents the direction
    //   negative: anticlockwise, positive: clockwise
    var factor = Math.floor(idx / this.size);
    // mod by the size to normalize the index now that we know the factor
    idx = modulo(idx, this.size);
    // the size of the resultant interval is now known
    var size = this.array[idx].toString(10);
    // time to calculate the quality
    var quality = '';
    if (factor > 0) {
        for (var f = 0; f < factor; f += 1) {
            quality += 'A';
        }
    }
    else if (factor === 0) {
        quality = idx < 3 ? 'P' : 'M';
    }
    else if (factor === -1) {
        quality = idx < 3 ? 'd' : 'm';
    }
    else if (factor < -1) {
        for (var nf = -1; nf > factor; nf -= 1) {
            quality += 'd';
        }
        quality += idx < 3 ? 'd' : '';
    }
    return quality + size;
};
var pitchNames = new Circle(['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']);
pitchNames.indexOf = function (member) {
    var parsed = validateNoteName(member).parse();
    if (!parsed) {
        throw new Error('Invalid pitch name.');
    }
    var alter = accidentalToAlter(parsed.accidental);
    var step_index = this.array.indexOf(parsed.step);
    // return pitch class if no octave given
    if (parsed.octave === null) {
        return mod12(step_index + alter);
    }
    return step_index + alter + (this.size * (parsed.octave + 1));
};
pitchNames.atIndex = function (index) {
    var octave = Math.floor(index / this.size) - 1;
    var note_index = mod12(index);
    return this.array[note_index] + octave.toString(10);
};

var circles = /*#__PURE__*/Object.freeze({
    fifths: fifths,
    intervals: intervals,
    pitchNames: pitchNames
});

function validateKeyName(keyName) {
    var keyRegex = /^([A-G])(b+|\#+|x+)* ?(m|major|minor)?$/i;
    return makeValidation('key', keyRegex, function (captures) {
        return {
            step: captures[1],
            accidental: captures[2] ? captures[2] : '',
            quality: captures[3] ? captures[3] : ''
        };
    })(keyName);
}

var Key = /** @class */ (function () {
    function Key(keyInput) {
        // run input through validation
        var parsed = validateKeyName(keyInput).parse();
        if (!parsed) {
            throw new Error('Invalid key name: ' + keyInput.toString());
        }
        // assign mode based on the parsed input's quality
        if (/[a-g]/.test(parsed.step) || parsed.quality === 'minor' || parsed.quality === 'm') {
            this.mode = 'minor';
        }
        else {
            this.mode = 'major';
        }
        // now that we have the mode, enforce uppercase for root note
        parsed.step = parsed.step.toUpperCase();
        // get fifths for major key
        this.fifths = fifths.indexOf(parsed.step + parsed.accidental);
        // minor is 3 fifths less than major
        if (this.mode === 'minor') {
            this.fifths -= 3;
            this.name = parsed.step.toLowerCase() + parsed.accidental + ' minor';
        }
        else {
            this.name = parsed.step + parsed.accidental + ' major';
        }
    }
    return Key;
}());

function transpose(note_name, direction, interval) {
    if (direction !== 'up' && direction !== 'down') {
        throw new Error('Transpose direction must be either "up" or "down".');
    }
    var parsed_n = validateNoteName(note_name).parse();
    if (!parsed_n) {
        throw new Error('Invalid note name.');
    }
    var parsed_i = validateIntervalName(interval).parse();
    if (!parsed_i) {
        throw new Error('Invalid interval name.');
    }
    var factor = direction === 'up' ? 1 : -1;
    var new_note_name = fifths.atIndex(fifths.indexOf(parsed_n.step + parsed_n.accidental) +
        (factor * intervals.indexOf(interval)));
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
function isString(input) {
    return typeof input === 'string';
}
function isNumber(input) {
    return typeof input === 'number';
}

var Note = /** @class */ (function () {
    function Note(noteInput) {
        var name;
        if (isString(noteInput)) {
            name = noteInput;
        }
        else if (isNumber(noteInput)) {
            name = pitchNames.atIndex(noteInput);
        }
        else {
            throw new TypeError('Note name must be a string or number.');
        }
        var parsed = validateNoteName(name).parse();
        if (!parsed) {
            throw new Error('Invalid note name.');
        }
        // For Note class, we only store the note name without octave
        this.name = parsed.step + parsed.accidental;
        this.pitchClass = pitchNames.indexOf(parsed.step + parsed.accidental);
        this.parts = {
            step: parsed.step,
            accidental: parsed.accidental
        };
    }
    Note.prototype.isEquivalent = function (other) {
        var otherNote;
        if (isString(other)) {
            otherNote = new Note(other);
        }
        else {
            otherNote = other;
        }
        return this.name === otherNote.name;
    };
    Note.prototype.isEnharmonic = function (other) {
        var otherNote;
        if (isString(other)) {
            otherNote = new Note(other);
        }
        else {
            otherNote = other;
        }
        return this.pitchClass === otherNote.pitchClass;
    };
    Note.prototype.transpose = function (direction, interval) {
        return new Note(transpose(this.name, direction, interval));
    };
    Note.prototype.intervalTo = function (note) {
        var otherNote;
        if (isString(note)) {
            otherNote = new Note(note);
        }
        else {
            otherNote = note;
        }
        return intervals.atIndex(fifths.indexOf(otherNote.name) - fifths.indexOf(this.name));
    };
    Note.prototype.intervalFrom = function (note) {
        var otherNote;
        if (isString(note)) {
            otherNote = new Note(note);
        }
        else {
            otherNote = note;
        }
        return intervals.atIndex(fifths.indexOf(this.name) - fifths.indexOf(otherNote.name));
    };
    Note.prototype.up = function (interval) {
        return this.transpose('up', interval);
    };
    Note.prototype.down = function (interval) {
        return this.transpose('down', interval);
    };
    Note.prototype.toString = function () {
        return '[note ' + this.name + ']';
    };
    return Note;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Pitch = /** @class */ (function (_super) {
    __extends(Pitch, _super);
    function Pitch(noteInput, octave) {
        var _this = this;
        if (isNumber(noteInput)) {
            // Handle MIDI number input
            var name_1 = pitchNames.atIndex(noteInput);
            var parsed = validateNoteName(name_1).parse();
            if (!parsed) {
                throw new Error('Invalid note name from MIDI number.');
            }
            _this = _super.call(this, parsed.step + parsed.accidental) || this;
            _this.setOctave(Math.floor(noteInput / 12) - 1);
        }
        else if (isString(noteInput)) {
            var parsed = validateNoteName(noteInput).parse();
            if (!parsed) {
                throw new Error('Invalid note name.');
            }
            if (parsed.octave !== null) {
                // Handle scientific notation (e.g., "C4")
                _this = _super.call(this, parsed.step + parsed.accidental) || this;
                _this.setOctave(parsed.octave);
            }
            else if (octave !== undefined) {
                // Handle note name + octave parameters (e.g., "C", 4)
                _this = _super.call(this, noteInput) || this;
                _this.setOctave(octave);
            }
            else {
                throw new Error('Octave must be specified for Pitch. Use Note class for notes without octave.');
            }
        }
        else {
            throw new TypeError('Input must be a string (note name or scientific notation) or number (MIDI).');
        }
        return _this;
    }
    Pitch.prototype.setOctave = function (octave) {
        if (!isNumber(octave)) {
            throw new TypeError('Octave must be a number.');
        }
        this.octave = octave;
        this.scientific = this.name + octave.toString(10);
        this.abc = scientificToAbc(this.scientific);
        this.midi = pitchNames.indexOf(this.scientific);
        this.frequency = mtof(this.midi);
    };
    Pitch.prototype.isEquivalent = function (other) {
        var otherNote = toNote(other);
        if (this.name !== otherNote.name) {
            return false;
        }
        if (otherNote instanceof Pitch && this.octave !== otherNote.octave) {
            return false;
        }
        return true;
    };
    Pitch.prototype.isEnharmonic = function (other) {
        var otherNote = toNote(other);
        if (this.pitchClass !== otherNote.pitchClass) {
            return false;
        }
        if (otherNote instanceof Pitch && (Math.abs(this.midi - otherNote.midi) > 11)) {
            return false;
        }
        return true;
    };
    Pitch.prototype.transpose = function (direction, interval) {
        return new Pitch(transpose(this.scientific, direction, interval));
    };
    Pitch.prototype.up = function (interval) {
        return this.transpose('up', interval);
    };
    Pitch.prototype.down = function (interval) {
        return this.transpose('down', interval);
    };
    Pitch.prototype.toString = function () {
        return '[pitch ' + this.scientific + ']';
    };
    return Pitch;
}(Note));
function toNote(input) {
    if (isString(input)) {
        var parsed = validateNoteName(input).parse();
        if (!parsed) {
            throw new Error('Invalid note name.');
        }
        if (parsed.octave !== null) {
            return new Pitch(input);
        }
        else {
            return new Note(input);
        }
    }
    else {
        return input;
    }
}

function validateChordName(chordName) {
    // lets split up this ugly regex
    var intro = /^/, root_note = /([A-G](?:b+|\#+|x+)?)/, species = /((?:maj|min|sus|aug|dim|mmaj|m|\-)?(?:\d+)?(?:\/\d+)?)?/, alterations = /((?:(?:add|sus)(?:\d+)|(?:sus|alt)|(?:\#|\+|b|\-)(?:\d+))*)/, bass_slash = /(\/)?/, bass_note = /([A-G](?:b+|\#+|x+)?)?/, outro = /$/;
    var chordRegex = new RegExp(intro.source +
        root_note.source +
        species.source +
        alterations.source +
        bass_slash.source +
        bass_note.source +
        outro.source);
    return makeValidation('chord', chordRegex, function (captures) {
        return {
            root: captures[1],
            species: captures[2] ? captures[2] : '',
            alterations: captures[3] ? captures[3] : '',
            slash: captures[4] ? captures[4] : '',
            bass: captures[5] ? captures[5] : ''
        };
    })(chordName);
}

function piaCompare(a, b) {
    var qualities = ['d', 'm', 'P', 'M', 'A'];
    if (a.size < b.size) {
        return -1;
    }
    else if (a.size > b.size) {
        return 1;
    }
    else {
        if (qualities.indexOf(a.quality) < qualities.indexOf(b.quality)) {
            return -1;
        }
        else if (qualities.indexOf(a.quality) > qualities.indexOf(b.quality)) {
            return 1;
        }
        else {
            return 0;
        }
    }
}
function isFalse(thing) {
    return thing === false;
}
var ParsedIntervalArray = /** @class */ (function () {
    function ParsedIntervalArray(intervalArray) {
        this.array = [];
        for (var i = 0; i < intervalArray.length; i++) {
            if (intervalArray[i] === 'R') {
                this.array.push({ quality: 'P', size: 1 });
            }
            else {
                var parsed = validateIntervalName(intervalArray[i]).parse();
                if (!isFalse(parsed))
                    this.array.push(parsed);
            }
        }
    }
    ParsedIntervalArray.prototype.sort = function () {
        return this.array.sort(piaCompare);
    };
    ParsedIntervalArray.prototype.add = function (interval) {
        var pInterval = validateIntervalName(interval).parse();
        if (!isFalse(pInterval)) {
            for (var i = 0; i < this.array.length; i++) {
                if (this.array[i].size === pInterval.size && this.array[i].quality === pInterval.quality) {
                    return;
                }
            }
            this.array.push(pInterval);
            this.sort();
        }
    };
    ParsedIntervalArray.prototype.remove = function (size) {
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
    ParsedIntervalArray.prototype.update = function (interval) {
        var pInterval = validateIntervalName(interval).parse();
        if (!isFalse(pInterval)) {
            // remove any intervals of the same size
            this.remove(pInterval.size);
            // add the new interval
            this.array.push(pInterval);
            this.sort();
        }
    };
    ParsedIntervalArray.prototype.unparse = function () {
        this.sort();
        var output = [];
        for (var i = 0; i < this.array.length; i++) {
            var str = this.array[i].quality + this.array[i].size;
            if (str === 'P1') {
                output.push('R');
            }
            else {
                output.push(str);
            }
        }
        return output;
    };
    return ParsedIntervalArray;
}());
var applyAlterations = (function () {
    var alteration_regex = /^(?:(?:add|sus|no)(?:\d+)|(?:sus|alt)|(?:n|b|\#|\+|\-)(?:\d+))/;
    // applies to alterations of the form (operation)(degree) such as 'b5' or '#9'
    var toInterval = function (alteration) {
        var valid = /(?:n|b|\#|\+|\-)(?:\d+)/;
        if (!valid.test(alteration)) {
            return false;
        }
        var operation = alteration.slice(0, 1);
        var degree = alteration.slice(1);
        if (operation === '+') {
            operation = '#';
        }
        if (operation === '-') {
            operation = 'b';
        }
        if (operation === '#') {
            return 'A' + degree;
        }
        if (operation === 'b') {
            if (degree === '5' || degree === '11' || degree === '4') {
                return 'd' + degree;
            }
            else {
                return 'm' + degree;
            }
        }
        if (operation === 'n') {
            if (degree === '5' || degree === '11' || degree === '4') {
                return 'P' + degree;
            }
            else {
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
    var alterationType = function (alteration) {
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
        }
        else {
            return 'M' + size.toString(10);
        }
    }
    return function (intervalArray, alterations) {
        var pia = new ParsedIntervalArray(intervalArray);
        var alterationArray = splitStringByPattern(alterations, alteration_regex);
        // for each alteration...
        for (var a = 0; a < alterationArray.length; a++) {
            var thisAlteration = alterationArray[a];
            switch (alterationType(thisAlteration)) {
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

var Chord = /** @class */ (function () {
    function Chord(chordName) {
        var parsed = validateChordName(chordName).parse();
        if (!parsed) {
            throw new Error('Invalid chord name.');
        }
        var speciesIntervals = getSpeciesIntervals(parsed.species);
        var memberIntervals = applyAlterations(speciesIntervals, parsed.alterations);
        this.name = chordName;
        this.type = 'chord';
        this.root = new Note(parsed.root);
        this.formula = parsed.species + parsed.alterations;
        this.isSlash = parsed.slash === '/' ? true : false;
        this.bass = this.isSlash ? new Note(parsed.bass) : this.root;
        this.intervals = memberIntervals;
        this.notes = getChordNotes(this.intervals, this.root);
    }
    Chord.prototype.transpose = function (direction, interval) {
        var root = this.root.transpose(direction, interval);
        return new Chord(root.name + this.formula);
    };
    Chord.prototype.toString = function () {
        return '[chord ' + this.name + ']';
    };
    return Chord;
}());
function getChordNotes(intervals, root) {
    var output = [];
    output.push(root);
    for (var i = 1; i < intervals.length; i++) {
        output.push(root.up(intervals[i]));
    }
    return output;
}
var getSpeciesIntervals = (function () {
    var basic_types = {
        five: ['R', 'P5'],
        maj: ['R', 'M3', 'P5'],
        min: ['R', 'm3', 'P5'],
        aug: ['R', 'M3', 'A5'],
        dim: ['R', 'm3', 'd5'],
        sus2: ['R', 'M2', 'P5'],
        sus4: ['R', 'P4', 'P5']
    };
    var extensions = {
        nine: ['M9'],
        eleven: ['M9', 'P11'],
        thirteen: ['M9', 'P11', 'M13']
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
        var prefix = captures[1] ? captures[1] : '', degree = captures[2] ? captures[2] : '';
        switch (prefix) {
            case '':
                if (degree === '6/9') {
                    output = output.concat(basic_types.maj, ['M6', 'M9']);
                }
                else {
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

var Interval = /** @class */ (function () {
    function Interval(intervalName) {
        var parsed = validateIntervalName(intervalName).parse();
        if (!parsed) {
            throw new Error('Invalid interval name.');
        }
        this.steps = parsed.size - 1;
        var normalizedSize = parsed.size > 7 ? (this.steps % 7) + 1 : parsed.size;
        this.name = intervalName;
        this.type = 'interval';
        this.quality = parsed.quality;
        this.size = parsed.size;
        this.normalized = this.quality + normalizedSize.toString(10);
        this.species = getIntervalSpecies(normalizedSize);
        // this is kinda ugly but it works...
        //   dividing by 7 evenly returns an extra octave if the value is a multiple of 7
        this.octaves = Math.floor(this.size / 7.001);
        this.semitones = getIntervalSemitones(this.quality, normalizedSize, this.octaves, this.species);
    }
    return Interval;
}());
function getIntervalSemitones(quality, normalizedSize, octaves, species) {
    // semitones from root of each note of the major scale
    var major = [0, 2, 4, 5, 7, 9, 11];
    // qualityInt represents the integer difference from a major or perfect quality interval
    //   for example, m3 will yield -1 since a minor 3rd is one semitone less than a major 3rd
    var qualityInt = 0;
    var q1 = quality.slice(0, 1);
    switch (q1) {
        case 'P':
        case 'M':
            break;
        case 'm':
            qualityInt -= 1;
            break;
        case 'A':
            qualityInt += 1;
            break;
        case 'd':
            if (species === 'M') {
                qualityInt -= 2;
            }
            else {
                qualityInt -= 1;
            }
            break;
    }
    // handle additional augmentations or diminutions
    for (var q = 0; q < quality.slice(1).length; q++) {
        if (quality.slice(1)[q] === 'd') {
            qualityInt -= 1;
        }
        else if (quality.slice(1)[q] === 'A') {
            qualityInt += 1;
        }
    }
    return major[normalizedSize - 1] + qualityInt + (octaves * 12);
}
// 1,4,5 are treated differently than other interval sizes,
//   this helps to identify them immediately
function getIntervalSpecies(size) {
    if (size === 1 || size === 4 || size === 5) {
        return 'P';
    }
    else {
        return 'M';
    }
}

export { Chord, Circle, Interval, Key, Note, Pitch, abc, circles };

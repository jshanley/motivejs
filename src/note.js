var validation      = require('./regex/note_name'),
    fifths          = require('./primitives/fifths'),
    pitch_classes   = require('./primitives/pitch_classes'),
    fifthsToPC      = require('./convert/fifths_to_pc'),
    mtof            = require('./convert/mtof'),
    transpose       = require('./utilities/transpose');

var note = (function() {
    
    var note_prototype = {
        name : 'C',
        pitch_class : 0,
        setOctave: function(octave) {
            if (typeof octave !== 'number') {
                throw new TypeError('Octave must be a number.');
            }
            this.octave = octave;
            this.scientific = this.name + octave.toString(10);
            this.midi = (12 * (octave + 1)) + this.pitchClass;
            this.frequency = mtof(this.midi);
        },
        transpose : function(direction, interval) {
            return note(transpose(this.scientific ? this.scientific : this.name, direction, interval));
        }
    };

    return function note(noteInput) {
        var name;
        if (typeof noteInput ==='string') {
            name = noteInput;
        } else if (typeof noteInput === 'number') {
            name = pitch_classes.atIndex(noteInput);
        } else {
            throw new TypeError('Note name must be a string or number.');
        }

        if (!validation.validate(name)) {
            throw new Error('Invalid note name.');
        }

        var parsed = validation.parse(name);
        
        var noteObj = Object.create(note_prototype);
        
        noteObj.name = name;
        noteObj.pitchClass = fifthsToPC(fifths.indexOf(parsed.step + parsed.accidental));

        noteObj.parts = {
            step: parsed.step,
            accidental: parsed.accidental
        };

        if (parsed.octave) {
            noteObj.name = parsed.step + parsed.accidental;
            noteObj.octave = parsed.octave;
            noteObj.scientific = name;
            noteObj.midi = (12 * (parsed.octave + 1)) + noteObj.pitchClass;
            noteObj.frequency = mtof(noteObj.midi);
        }
        
        return noteObj;
    };

})();

module.exports = note;

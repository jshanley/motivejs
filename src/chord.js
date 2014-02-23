var validate    = require('./regex/chord_name'),
    note        = require('./note'),
    toObject    = require('./utilities/to_object'),
    transpose   = require('./utilities/transpose');

var chord = (function() {

    var toNote = function(input) {
        return toObject(input, note);
    };

    var chord_prototype = {
        name: 'Cm7',
        root: 'C',
        formula: 'm7',
        intervals: [],
        members: [],
        transpose: function(direction, interval) {
            var root = transpose(this.root, direction, interval);
            return chord(root + this.formula);
        },
        contains: function(member) {
            member = toNote(member);
            var isMember = false;
            for (var m = 0; m < this.members.length; m++) {
                if (this.members[m].isEquivalent(member)) {
                     isMember = true;
                     break;
                }
            }
            return isMember;
        }
    };

    return function chord(chordInput) {
        var parsed = validate(chordInput).parse();
        if (!parsed) {
            throw new Error('Invalid chord name.');
        }
        var chordObj = Object.create(chord_prototype);
        chordObj.name = chordInput;
        chordObj.root = parsed.root;
        chordObj.formula = parsed.species + parsed.alterations;
        chordObj.isSlash = parsed.slash === '/' ? true : false;
        chordObj.bass = chordObj.isSlash ? parsed.bass : parsed.root;

    };

})();

module.exports = chord;
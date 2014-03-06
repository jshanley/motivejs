var validate            = require('../regex/validation/chord_name'),
    note                = require('../note'),
    toObject            = require('../utilities/to_object'),
    transpose           = require('../utilities/transpose'),
    getSpeciesIntervals = require('./get_species_intervals'),
    applyAlterations    = require('./apply_alterations');


function JazzChord(chord_name) {
    var parsed = validate(chord_name).parse();
    if (!parsed) {
        throw new Error('Invalid chord name.');
    }
    var speciesIntervals = getSpeciesIntervals(parsed.species);

    var memberIntervals = applyAlterations(speciesIntervals, parsed.alterations);

    this.name = chord_name;
    this.root = parsed.root;
    this.formula = parsed.species + parsed.alterations;
    this.isSlash = parsed.slash === '/' ? true : false;
    this.bass = this.isSlash ? parsed.bass : parsed.root;
} 



module.exports = function(chord_name) {
    return new JazzChord(chord_name);
};
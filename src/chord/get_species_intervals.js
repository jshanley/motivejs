module.exports = (function(){

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

    var species_regex = /^(maj|min|mmin|m|aug|dim|alt|sus|\-)?((?:\d+)|6\/9?)?$/;

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

        var captures = species_regex.exec(species);

        var prefix = captures[1] ? captures[1] : '',
            degree = captures[2] ? captures[2] : '';




    };

})();
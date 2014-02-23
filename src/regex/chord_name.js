var makeValidation = require('./validation_factory');

var validation = (function() {

    // lets split up this ugly regex
    var intro       = /^/,
        root_note   = /([A-G](?:b+|\#+|x+)?)/,
        species     = /((?:maj|min|sus|aug|dim|mmaj|m|\-)?(?:\d+)?(?:\/)?(?:\d)?)?/,
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
            species:        captures[2] ? captures[2] : '',
            alterations:    captures[3] ? captures[3] : '',
            slash:          captures[4] ? captures[4] : '',
            bass:           captures[5] ? captures[5] : ''
        };
    });

})();

module.exports = function(chord_name) {
    return validation(chord_name);
};

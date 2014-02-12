utilities.parseChordFormula = function(formula) {

    //the root is a given
    var interval_members = ['R'];

    //check quality of third
    //first make sure it's not a 5 chord or a sus chord
    if (formula !== '5' && !formula.match(/sus/)) {
        if (formula.match(/m(?:[1-9]|m)/) || formula.match(/min/) || formula.match(/dim/) || formula === 'm') {
            interval_members.push('m3');
        } else {
            interval_members.push('M3');
        }
    }
    //check for sus2 or sus4, unspecified sus will default to sus4
    if (formula.match(/sus2/)) {
        interval_members.push('M2');
    } else if (formula.match(/sus/)) {
        interval_members.push('P4');
    }
    //check for the rare #4, should usually be #11 but we'll play along
    if (formula.match(/(\+4|#4)/)) {
        interval_members.push('A4');
    }
    //check quality of fifth
    if (formula.match(/(\-5|b5)/) || formula.match(/dim/)) {
        interval_members.push('d5');
    } else if (formula.match(/(\+5|#5)/) || formula.match(/aug/)) {
        interval_members.push('A5');
    } else {
        interval_members.push('P5');
    }
    //sixth chords, all altered sixths must be spelled as 13ths, no playing along here
    if (formula === '6' || formula === 'm6' || formula === '6/9' || formula === 'm6/9') {
        interval_members.push('M6');
    }
    //check quality of seventh
    if (formula.match(/dim7/)) {
        interval_members.push('d7');
    } else if (formula.match(/(m7|min7)/)) {
        interval_members.push('m7');
    } else if (formula.match(/(maj7|maj9|maj11|maj13)/)) {
        interval_members.push('M7');
    } else if (formula.match(/(7|9|11|13)/) && formula !== '6/9' && formula !== 'm6/9') {
        interval_members.push('m7');
    }
    //check quality of ninth
    if (formula.match(/(\-9|b9)/)) {
        interval_members.push('m9');
    } else if (formula.match(/(\+9|#9)/)) {
        interval_members.push('A9');
    } else if (formula.match(/(9|11|13)/)) {
        interval_members.push('M9');
    }
    //check quality of eleventh
    if (formula.match(/(\-11|b11)/)) {
        interval_members.push('d11');
    } else if (formula.match(/(\+11|#11)/)) {
        interval_members.push('A11');
    } else if (formula.match(/(11|13)/)) {
        interval_members.push('P11');
    }
    //check quality of thirteenth
    if (formula.match(/(\-13|b13)/)) {
        interval_members.push('m13');
    } else if (formula.match(/(\+13|#13)/)) {
        interval_members.push('A13');
    } else if (formula.match(/13/)) {
        interval_members.push('M13');
    }
    return interval_members;
};
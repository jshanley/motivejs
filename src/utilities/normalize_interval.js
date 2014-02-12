// this function takes an interval, and if it is larger than an octave (8),
//   then it normalizes it to be less than an octave.
//   for example 'm13' becomes 'm6'

utilities.normalizeInterval = function(interval_name) {
    var output;
    if (interval_name.match(/13/)) {
        output = interval_name.replace(/13/, '6');
    } else if (interval_name.match(/11/)) {
        output = interval_name.replace(/11/, '4');
    } else if (interval_name.match(/9/)) {
        output = interval_name.replace(/9/, '2');
    }
    if (output) {
        return output;
    } else {
        return interval_name;
    }
};
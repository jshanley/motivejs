var Circle              = require('../math/circle'),
    modulo              = require('../math/modulo'),
    validation          = require('../regex/interval_name');

var intervals = new Circle([4,1,5,2,6,3,7]);
intervals.indexOf = function(interval_name) {

    if (!validation.validate(interval_name)) {
        throw new Error('Invalid interval name.');
    }
    var parsed = validation.parse(interval_name);

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
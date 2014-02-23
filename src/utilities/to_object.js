// ensures that a function requiring a note (or similar type of) object as input
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
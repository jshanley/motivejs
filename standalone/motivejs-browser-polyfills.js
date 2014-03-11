// Object.create()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
if (typeof Object.create !== 'function') {
  (function() {
    var F = function() {};
    Object.create = function(o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (o === null) {
        throw new Error('Cannot set a null [[Prototype]]');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      F.prototype = o;
      return new F();
    };
  })();
}

// Array.prototype.indexOf()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    if (this === undefined || this === null) {
      throw new TypeError('"this" is null or not defined');
    }

    var length = this.length >>> 0; // Hack to convert object.length to a UInt32

    fromIndex = +fromIndex || 0;

    if (Math.abs(fromIndex) === Infinity) {
      fromIndex = 0;
    }

    if (fromIndex < 0) {
      fromIndex += length;
      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }

    for (; fromIndex < length; fromIndex++) {
      if (this[fromIndex] === searchElement) {
        return fromIndex;
      }
    }

    return -1;
  };
}

  if (typeof define === 'function' && define.amd) {
    define(motive);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = motive;
  } else {
    this.motive = motive;
  }
})();

	if (typeof define === 'function' && define.amd) {
		define(Motive);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = Motive;
	} else {
		this.Motive = Motive;
	}
}();
module.exports = (function() {

	var interval_regex = /(P|M|m|A+|d+)(\d+|U)/;

	return {
		validate: function(interval_name) {
			if (typeof interval_name !== 'string') {
				throw new TypeError('Invalid interval name, must be a string.');
			}
			return interval_name.match(interval_regex) ? true : false;
		},
		parse: function(interval_name) {
			var captures = interval_regex.exec(interval_name);
			return {
				quality: captures[1],
				size: parseInt(captures[2], 10)
			};
		}
	};
})();
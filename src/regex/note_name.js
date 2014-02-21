module.exports = (function() {

	var note_regex = /^([A-G])(b+|\#+|x+)?(\-?[0-9]+)?$/;

	return {
		validate: function(note_name) {
			if (typeof note_name !== 'string') {
				throw new TypeError('Invalid note name, must be a string.');
			}
			return note_name.match(note_regex) ? true : false;
		},
		parse: function(note_name) {
			var captures = note_regex.exec(note_name);
			return {
				step: captures[1],
				accidental: captures[2] ? captures[2] : '',
				octave: captures[3] ? parseInt(captures[3], 10) : null
			};
		}
	};
})();
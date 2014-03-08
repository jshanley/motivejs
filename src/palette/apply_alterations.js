var splitStringByPattern = require('../regex/split_string_by_pattern'),
		ParsedIntervalArray  = require('./parsed_interval_array');


module.exports = (function() {

	var alteration_regex = /^(?:(?:add|sus|no)(?:\d+)|(?:sus|alt)|(?:n|b|\#|\+|\-)(?:\d+))/;

	// applies to alterations of the form (operation)(degree) such as 'b5' or '#9'
	var toInterval = function(alteration) {
		var valid = /(?:n|b|\#|\+|\-)(?:\d+)/;
		if (!valid.test(alteration)) {
			return false;
		}
		var operation = alteration.slice(0,1);
		var degree = alteration.slice(1);
		if (operation === '+') { operation = '#'; }
		if (operation === '-') { operation = 'b'; }
		if (operation === '#') {
			return 'A' + degree;
		}
		if (operation === 'b') {
			if (degree === '5' || degree === '11' || degree === '4') {
				return 'd' + degree;
			} else {
				return 'm' + degree;
			}
		}
		if (operation === 'n') {
			if (degree === '5' || degree === '11' || degree === '4') {
				return 'P' + degree;
			} else {
				return 'M' + degree;
			}
		}
	};

/* might want this later
	var intervalType = function(parsed_interval) {
		if (parsed_interval.quality === 'P' || parsed_interval.quality === 'M') {
			return 'natural';
		} else {
			return 'altered';
		}
	};
*/
	var alterationType = function(alteration) {
		if (/sus/.test(alteration)) {
			return 'susX';
		}
		if (/add/.test(alteration)) {
			return 'addX';
		}
		if (/no/.test(alteration)) {
			return 'noX';
		}
		if (/alt/.test(alteration)) {
			return 'alt';
		}
		return 'binary';
	};



	function getNaturalInterval(size) {
		var normalized = size < 8 ? size : size % 7;
		if (normalized === 1 || normalized === 4 || normalized === 5) {
			return 'P' + size.toString(10);
		} else {
			return 'M' + size.toString(10);
		}
	}



	return function(interval_array, alterations) {
		var pia = new ParsedIntervalArray(interval_array);
		var alterationArray = splitStringByPattern(alterations, alteration_regex);
		// for each alteration...
		for (var a = 0; a < alterationArray.length; a++) {
			var thisAlteration = alterationArray[a];
			switch(alterationType(thisAlteration)) {
				case 'binary':
					var asInterval = toInterval(thisAlteration);
					pia.update(asInterval);
					break;
				case 'susX':
					pia.remove(3);
					pia.add('P4');
					break;
				case 'addX':
					var addition = parseInt(thisAlteration.slice(3), 10);
					pia.add(getNaturalInterval(addition));
					break;
				case 'noX':
					var removal = parseInt(thisAlteration.slice(2), 10);
					pia.remove(removal);
					break;
				case 'alt':
					pia.update('d5');
					pia.add('A5');
					pia.update('m9');
					pia.add('A9');
					pia.update('m13');
					break;
			}
		}

		return pia.unparse();
	};
})();

var validate = require('../regex/validation/interval_name');
var splitStringByPattern = require('../regex/split_string_by_pattern');

module.exports = (function() {
	
	var alteration_regex = /^(?:(?:add|sus|no)(?:\d+)|(?:sus|alt)|(?:n|\#|\+|b|\-)(?:\d+))/;

	// applies to alterations of the form (operation)(degree) such as 'b5' or '#9'
	var toInterval = function(alteration) {
		var valid = /(?:n|\#|\+|b|\-)(?:\d+)/;
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

	var toParsed = function(interval_array) {
		var output = [];
		for (var i = 0; i < interval_array.length; i++) {
			output.push(validate(interval_array[i].parse()));
		}
		return output;
	};

	var unParse = function(parsed_interval_array) {
		var output = [];
		for (var i = 0; i < parsed_interval_array.length; i++) {
			var str = parsed_interval_array[i].quality + parsed_interval_array[i].size;
			output.push(str);
		}
		return output;
	};

	var intervalType = function(parsed_interval) {
		if (parsed_interval.quality === 'P' || parsed_interval.quality === 'M') {
			return 'major';
		} else {
			return 'altered';
		}
	};

	// type may be 'major' or 'altered'
	var findIntervalTypeAndSize = function(parsed_interval_array, type, size) {
		for (var i = 0; i < parsed_interval_array.length; i++) {
			var current = parsed_interval_array[i];
			if (current.size === size && intervalType(current) === type) {
				return i;
			}
		}
		return 'none';
	};

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

	return function(interval_array, alterations) {
		var parsed_interval_array = toParsed(interval_array);
		var alterationArray = splitStringByPattern(alterations, alteration_regex);		
		for (var a = 0; a < alterationArray.length; a++) {
			var thisAlteration = alterationArray[a];
			switch(alterationType(thisAlteration)) {
				case 'binary':
					break;
				case 'susX':
					break;
				case 'addX':
					break;
				case 'noX':
					break;
				case 'alt':
					break;
			}
		}

		return interval_array;
	};
})();
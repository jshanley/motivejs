import validateIntervalName from './validators/interval';
import {splitStringByPattern} from './regex';


function piaCompare(a,b) {
  var qualities = ['d','m','P','M','A'];
  if (a.size < b.size) {
    return -1;
  } else if (a.size > b.size) {
    return 1;
  } else {
    if (qualities.indexOf(a.quality) < qualities.indexOf(b.quality)) {
      return -1;
    } else if (qualities.indexOf(a.quality) > qualities.indexOf(b.quality)) {
      return 1;
    } else {
      return 0;
    }
  }
}

function isFalse(thing: any): thing is false {
  return thing === false;
}


class ParsedIntervalArray {

  array: Array<{
    quality: string,
    size: number
  }>;

  constructor(intervalArray) {
    this.array = [];
    for (var i = 0; i < intervalArray.length; i++) {
      if (intervalArray[i] === 'R') {
        this.array.push({quality: 'P', size: 1});
      } else {
        const parsed = validateIntervalName(intervalArray[i]).parse();
        if (!isFalse(parsed)) this.array.push(parsed);
      }
    }
  }

  sort() {
    return this.array.sort(piaCompare);
  }

  add(interval) {
    var pInterval = validateIntervalName(interval).parse();
    if (!isFalse(pInterval)) {
      for (var i = 0; i < this.array.length; i++) {
        if (this.array[i].size === pInterval.size && this.array[i].quality === pInterval.quality) {
          return;
        }
      }
      this.array.push(pInterval);
      this.sort();
    }
  }

  remove(size) {
    // alias is the octave equivalent of size, for instance
    //   the alias of 2 is 9, alias of 13 is 6
    var alias = size <= 7 ? size + 7 : size - 7;
    var updated = [];
    // add all intervals that are not of the given size or its alias
    for (var i = 0; i < this.array.length; i++) {
      if (this.array[i].size !== size && this.array[i].size !== alias) {
        updated.push(this.array[i]);
      }
    }
    this.array = updated;
  }

  update(interval) {
    var pInterval = validateIntervalName(interval).parse();
    if (!isFalse(pInterval)) {
        // remove any intervals of the same size
      this.remove(pInterval.size);
      // add the new interval
      this.array.push(pInterval);
      this.sort();
    }
  }

  unparse() {
    this.sort();
    var output = [];
    for (var i = 0; i < this.array.length; i++) {
      var str = this.array[i].quality + this.array[i].size;
      if (str === 'P1') {
        output.push('R');
      } else {
        output.push(str);
      }
    }
    return output;
  }
}

const applyAlterations = (function() {

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

  return function(intervalArray, alterations) {
    var pia = new ParsedIntervalArray(intervalArray);
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

export {
  ParsedIntervalArray,
  applyAlterations
};
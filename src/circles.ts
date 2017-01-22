import {Circle, modulo, mod12} from './math';
import {accidentalToAlter, alterToAccidental} from './convert';
import validateNoteName from './validators/note';
import validateIntervalName from './validators/interval';


let fifths: Circle<string, string> = new Circle(['F','C','G','D','A','E','B']);
fifths.indexOf = function(this: Circle<string, string>, noteName: string) {
  var step = noteName[0],
      accidental = noteName.slice(1),
      alter = accidentalToAlter(accidental);
  var index = this.array.indexOf(step);
  index = index + (this.size * alter);
  return index - 1;
};
fifths.atIndex = function(this: Circle<string, string>, index: number) {
  index = index + 1;
  var alter = Math.floor(index / this.array.length),
      accidental = alterToAccidental(alter);
  index = modulo(index, this.size);
  return this.array[index] + accidental;
};

// these values represent the size of intervals arranged by fifths.
// Given 4, each value is value[i] = mod7(value[i-1] + 4) with
//   the exception that zero is avoided by setting mod7(7) = 7
let intervals: Circle<number, string> = new Circle([4,1,5,2,6,3,7]);
intervals.indexOf = function(intervalName) {

  var parsed = validateIntervalName(intervalName).parse();
  if (!parsed) {
    throw new Error('Invalid interval name.');
  }

  var quality = parsed.quality,
      size = parsed.size;

  // string to integer, make 'unison' into size 1
  // size = size === 'U' ? 1 : parseInt(size, 10);

  // normalize large intervals
  size = size <= 7 ? size : modulo(size, this.size);

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
  idx = modulo(idx, this.size);

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

let pitchNames: Circle<string, string> = new Circle(['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B']);
pitchNames.indexOf = function(member) {
  var parsed = validateNoteName(member).parse();
  if (!parsed) {
    throw new Error('Invalid pitch name.');
  }
  var alter = accidentalToAlter(parsed.accidental);
  var step_index = this.array.indexOf(parsed.step);
  // return pitch class if no octave given
  if (parsed.octave === null) {
    return mod12(step_index + alter);
  }
  return step_index + alter + (this.size * (parsed.octave + 1));
};
pitchNames.atIndex = function(index) {
  var octave = Math.floor(index / this.size) - 1;
  var note_index = mod12(index);
  return this.array[note_index] + octave.toString(10);
};


export {
  fifths,
  intervals,
  pitchNames
};
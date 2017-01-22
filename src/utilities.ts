import {steps} from './primitives';
import validateNoteName from './validators/note';
import validateIntervalName from './validators/interval';
import {fifths, intervals} from './circles';


function transpose(note_name: string, direction: string, interval: string): string {
  if (direction !== 'up' && direction !== 'down') {
    throw new Error('Transpose direction must be either "up" or "down".');
  }
  var parsed_n = validateNoteName(note_name).parse();
  if (!parsed_n) {
    throw new Error('Invalid note name.');
  }
  var parsed_i = validateIntervalName(interval).parse();
  if (!parsed_i) {
    throw new Error('Invalid interval name.');
  }

  var factor = direction === 'up' ? 1 : -1;

  var new_note_name = fifths.atIndex(
    fifths.indexOf(parsed_n.step + parsed_n.accidental) +
    (factor * intervals.indexOf(interval))
  );

  // check if octave adjustment is needed
  if (parsed_n.octave === null) {
    return new_note_name;
  }

  // octave adjustment
  var new_octave = parsed_n.octave + (factor * Math.floor(parsed_i.size / 8));
  var normalized_steps = parsed_i.size > 7 ? (parsed_i.size % 7) - 1 : parsed_i.size - 1;
  if ((steps.indexOf(parsed_n.step) + normalized_steps) >= 7) {
    new_octave += factor;
  }
  return new_note_name + new_octave.toString(10);
};

function isString(input: any): input is string {
  return typeof input === 'string';
}

function isNumber(input: any): input is number {
  return typeof input === 'number';
}

// ensures that a function requiring a note (or similar type of) object as input
//   gets an object rather than a string representation of it.
//   'obj' will be the function used to create the object.
function toObject<T>(input: T|string, obj: (s: string) => T): T {
  if (isString(input)) {
    input = obj(input);
  }
  if (typeof input !== 'object') {
    throw new TypeError('Input must be an object or string.');
  }
  return input;
}

export {
  transpose,
  isString,
  isNumber,
  toObject
};
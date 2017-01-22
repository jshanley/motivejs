import Note from './note';
import NoteCollection from './note-collection';
import validateChordName from './validators/chord';
import {transpose} from './utilities';
import {applyAlterations} from './palette';


class Chord {

  name: string;
  type: 'chord';
  root: Note;
  formula: string;
  isSlash: boolean;
  bass: Note;
  intervals: string[];
  notes: NoteCollection;

  constructor(chordName: string) {
    var parsed = validateChordName(chordName).parse();
    if (!parsed) {
      throw new Error('Invalid chord name.');
    }
    var speciesIntervals = getSpeciesIntervals(parsed.species);

    var memberIntervals = applyAlterations(speciesIntervals, parsed.alterations);

    this.name = chordName;
    this.type = 'chord';
    this.root = new Note(parsed.root);
    this.formula = parsed.species + parsed.alterations;
    this.isSlash = parsed.slash === '/' ? true : false;
    this.bass = this.isSlash ? new Note(parsed.bass) : this.root;
    this.intervals = memberIntervals;
    this.notes = getChordNotes(this.intervals, this.root);
  }

  transpose(direction: string, interval: string) {
    const root = this.root.transpose(direction, interval);
    return new Chord(root.name + this.formula);
  }

  toString() {
    return '[chord ' + this.name + ']';
  }
}

function getChordNotes(intervals, root) {
  var output = [];
  output.push(root);
  for (var i = 1; i < intervals.length; i++) {
    output.push(root.up(intervals[i]));
  }
  return new NoteCollection(output);
}

var getSpeciesIntervals = (function(){

  var basic_types = {
    five: ['R','P5'],
    maj: ['R','M3','P5'],
    min: ['R','m3','P5'],
    aug: ['R','M3','A5'],
    dim: ['R','m3','d5'],
    sus2: ['R','M2','P5'],
    sus4: ['R','P4','P5']
  };

  var extensions = {
    nine: ['M9'],
    eleven: ['M9','P11'],
    thirteen: ['M9','P11','M13']
  };

  var species_regex = /^(maj|min|mmin|m|aug|dim|alt|sus|\-)?((?:\d+)|(?:6\/9))?$/;

  return function getSpeciesIntervals(species: string): string[] {

    // easy stuff
    if (species in basic_types) {
      return basic_types[species];
    }
    if (species === '') {
      return basic_types.maj;
    }
    if (species === '5') {
      return basic_types.five;
    }
    if (species === 'm' || species === '-') {
      return basic_types.min;
    }
    if (species === 'sus') {
      return basic_types.sus4;
    }

    var output = [];

    var captures = species_regex.exec(species);

    var prefix = captures[1] ? captures[1] : '',
        degree = captures[2] ? captures[2] : '';

    switch (prefix) {
      case '':
        if (degree === '6/9') {
          output = output.concat(basic_types.maj, ['M6','M9']);
        } else {
          output = output.concat(basic_types.maj, degree === '6' ? 'M6' : 'm7');
        }
        break;
      case 'maj':
        output = output.concat(basic_types.maj, degree === '6' ? 'M6' : 'M7');
        break;
      case 'min':
      case 'm':
      case '-':
        output = output.concat(basic_types.min, degree === '6' ? 'M6' : 'm7');
        break;
      case 'aug':
        output = output.concat(basic_types.aug, degree === '6' ? 'M6' : 'm7');
        break;
      case 'dim':
        output = output.concat(basic_types.dim, 'd7');
        break;
      case 'mmaj':
        output = output.concat(basic_types.min, 'M7');
        break;
      default:
        break;
    }

    switch (degree) {
      case '9':
        output = output.concat(extensions.nine);
        break;
      case '11':
        output = output.concat(extensions.eleven);
        break;
      case '13':
        output = output.concat(extensions.thirteen);
        break;
      default:
        break;
    }
    return output;
  };

})();


export default Chord;
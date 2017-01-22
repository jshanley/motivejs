import validateIntervalName from './validators/interval';


class Interval {

  steps: number;
  name: string;
  type: string;
  quality: string;
  size: number;
  normalized: string;
  species: string;
  octaves: number;
  semitones: number;

  constructor(intervalName: string) {
    var parsed = validateIntervalName(intervalName).parse();
    if (!parsed) {
      throw new Error('Invalid interval name.');
    }

    this.steps = parsed.size - 1;
    var normalizedSize = parsed.size > 7 ? (this.steps % 7) + 1 : parsed.size;

    this.name = intervalName;
    this.type = 'interval';
    this.quality = parsed.quality;
    this.size = parsed.size;
    this.normalized = this.quality + normalizedSize.toString(10);


    this.species = getIntervalSpecies(normalizedSize);

    // this is kinda ugly but it works...
    //   dividing by 7 evenly returns an extra octave if the value is a multiple of 7
    this.octaves = Math.floor(this.size / 7.001);

    this.semitones = getIntervalSemitones(this.quality, normalizedSize, this.octaves, this.species);
  }
}

function getIntervalSemitones(quality, normalizedSize, octaves, species) {
  // semitones from root of each note of the major scale
  var major = [0,2,4,5,7,9,11];

  // qualityInt represents the integer difference from a major or perfect quality interval
  //   for example, m3 will yield -1 since a minor 3rd is one semitone less than a major 3rd
  var qualityInt = 0;
  var q1 = quality.slice(0,1);
  switch (q1) {
    case 'P':
    case 'M':
      break;
    case 'm':
      qualityInt -=  1;
      break;
    case 'A':
      qualityInt += 1;
      break;
    case 'd':
      if (species === 'M') {
        qualityInt -= 2;
      } else {
        qualityInt -= 1;
      }
      break;
  }
  // handle additional augmentations or diminutions
  for (var q = 0; q < quality.slice(1).length; q++) {
    if (quality.slice(1)[q] === 'd') {
      qualityInt -= 1;
    } else if (quality.slice(1)[q] === 'A') {
      qualityInt += 1;
    }
  }

  return major[normalizedSize - 1] + qualityInt + (octaves * 12);
}

// 1,4,5 are treated differently than other interval sizes,
//   this helps to identify them immediately
function getIntervalSpecies(size) {
  if (size === 1 || size === 4 || size === 5) {
    return 'P';
  } else {
    return 'M';
  }
}

export default Interval;

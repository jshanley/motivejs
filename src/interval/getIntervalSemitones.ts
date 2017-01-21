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

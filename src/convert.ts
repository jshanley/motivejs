import {operators} from './primitives'


function accidentalToAlter(accidental: string): number {
  if (!accidental) {
    return 0;
  }
  var totalSymbolValue = 0;
  // look up the value of each symbol in the parsed accidental
  for (var a = 0; a < accidental.length; a++){
    totalSymbolValue += operators[accidental[a]];
  }
  // add the total value of the accidental to alter
  return totalSymbolValue;
}

function alterToAccidental(alter: number): string {
  if (typeof alter === 'undefined') {
    throw new Error('Cannot convert alter to accidental, none given.');
  }
  if (alter === 0 || alter === null) {
    return '';
  }
  let accidental = '';
  while (alter < 0) {
    accidental += 'b';
    alter += 1;
  }
  while (alter > 1) {
    accidental += 'x';
    alter += -2;
  }
  while (alter > 0) {
    accidental += '#';
    alter += -1;
  }
  return accidental;
}

function mtof(midi: number): number {
  return Math.pow(2, ((midi - 69) / 12)) * 440;
}

export {
  accidentalToAlter,
  alterToAccidental,
  mtof
};
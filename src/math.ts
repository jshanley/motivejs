interface ICircle<T, U> {
  array: T[];
  size: number;
  indexOf: (item: U) => number;
  atIndex: (index: number) => T;
}

class Circle<T, U> implements ICircle<T, U> {
  array: any[];
  size: number;

  constructor(array: any[]) {
    this.array = array;
    this.size = array.length;
  }

  // define functions for simple circular lookup
  // most instances will override these functions
  //   with custom accessors
  indexOf(item: U) {
    return this.array.indexOf(item);
  }

  atIndex(index: number) {
    return this.array[modulo(index, this.size)];
  }

}

function modulo(a: number, b: number): number {
  if (a >= 0) {
    return a % b;
  } else {
    return ((a % b) + b) % b;
  }
}

function mod7(a: number): number {
  return modulo(a, 7);
}

function mod12(a: number): number {
  return modulo(a, 12);
}

export {
  ICircle,
  Circle,
  modulo,
  mod7,
  mod12
};
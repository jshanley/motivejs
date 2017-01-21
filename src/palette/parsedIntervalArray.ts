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

palette.ParsedIntervalArray = function(interval_array) {
  this.array = [];
  for (var i = 0; i < interval_array.length; i++) {
    if (interval_array[i] === 'R') {
      this.array.push({quality: 'P', size: 1});
    } else {
      this.array.push(regex.validate.intervalName(interval_array[i]).parse());
    }
  }
}

palette.ParsedIntervalArray.prototype.sort = function() {
  return this.array.sort(piaCompare);
};
palette.ParsedIntervalArray.prototype.add = function(interval) {
  var pInterval = regex.validate.intervalName(interval).parse();
  for (var i = 0; i < this.array.length; i++) {
    if (this.array[i].size === pInterval.size && this.array[i].quality === pInterval.quality) {
      return;
    }
  }
  this.array.push(pInterval);
  this.sort();
};
palette.ParsedIntervalArray.prototype.remove = function(size) {
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
};
palette.ParsedIntervalArray.prototype.update = function(interval) {
  var pInterval = regex.validate.intervalName(interval).parse();
  // remove any intervals of the same size
  this.remove(pInterval.size);
  // add the new interval
  this.array.push(pInterval);
  this.sort();
};
palette.ParsedIntervalArray.prototype.unparse = function() {
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
};

import "../utilities/";

var NoteCollection = function(noteArray) {
	noteArray = noteArray || [];
  this.array = noteArray.map(function(d) {
    return utilities.toObject(d, motive.note);
  });
	return this;
};

NoteCollection.prototype.contents = function() {
  return this.array;
};
NoteCollection.prototype.each = function(f) {
  this.array.forEach(f);
  return this;
};
NoteCollection.prototype.contains = function(note) {
  note = utilities.toObject(note, motive.note);
  var output = false;
  this.each(function(d) {
    if (d.isEquivalent(note)) output = true;
  });
  return output;
};
NoteCollection.prototype.add = function(note) {
  note = utilities.toObject(note, motive.note);
	this.array.push(note);
	return this;
};
NoteCollection.prototype.remove = function(note) {
  note = utilities.toObject(note, motive.note);
  this.array = this.array.filter(function(d) {
    return !d.isEquivalent(note);
  });
  return this;
};
NoteCollection.prototype.map = function(f) {
  return new NoteCollection(this.array.map(f));
};
NoteCollection.prototype.names = function() {
	return this.array.map(function(d) {
		return d.name;
	})
};
NoteCollection.prototype.patternFrom = function(note) {
  note = utilities.toObject(note, motive.note);
  if (!this.contains(note)) return motive.pattern([]);
  var intervals = [];
  this.each(function(d) {
    intervals.push(motive.interval(d.intervalFrom(note)));
  });
  intervals.sort(function(a,b) {
    return a.size - b.size;
  });
  intervals = intervals.map(function(d) {
    var name = d.name !== 'P1' ? d.name : 'R';
    return name;
  });
  return motive.pattern(intervals);
};
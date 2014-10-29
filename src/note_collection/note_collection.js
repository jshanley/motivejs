var NoteCollection = function(noteArray) {
	this.array = noteArray || [];
	return this;
};

NoteCollection.prototype.add = function(item) {
	this.array.push(item);
	return this;
};
NoteCollection.prototype.names = function() {
	return this.array.map(function(d) {
		return d.name;
	})
};
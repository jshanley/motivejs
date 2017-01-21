var Pattern = function(a) {
	this.intervalNames = a;
	return this;
};

Pattern.prototype.from = function(note) {
	note = utilities.toObject(note, motive.note)
	return motive.noteCollection(this.intervalNames.map(function(d) {
		if (d === 'R') d = 'P1';
		return note.up(d);
	}))
}


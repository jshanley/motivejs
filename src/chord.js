Motive.Chord = function(name){

	if (!name.match(/^([A-G](?:bb|x|b|#)?)(.*)/)) {
		console.log('invalid root');
	}

	var root = name.replace(/([A-G](?:bb|x|b|#)?)(.*)/g, '$1');
	var formula = name.replace(/([A-G](?:bb|x|b|#)?)(.*)/g, '$2');
	this.root = root;
	this.formula = formula;

	var interval_members = parseChordFormula(formula);

	var scale_members = [];
	for (var i = 0; i < interval_members.length; i++) {
		//push normalized interval
		scale_members.push(normalizeInterval(interval_members[i]));
	}

	var note_member_names = getNoteNamesFromIntervalArray(root, scale_members);

	var note_members = [];
	for (var n = 0; n < note_member_names.length; n++) {
		note_members.push(new Motive.Note(note_member_names[n]));
	}

	this.note_members = note_members;
	this.interval_members = interval_members;
	this.scale_members = scale_members;
	this.full_name = root + formula;

	return this;
};

Motive.Chord.prototype.transpose = function(direction, interval){
	var root = this.root;
	var newroot = transpose(root, direction, interval);
	return new Motive.Chord(newroot + this.formula);
};
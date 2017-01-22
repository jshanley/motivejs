import {toObject, isString} from './utilities';
import Note from './note';
import NoteCollection from './note-collection';


class Pattern {

	intervalNames: string[];

	constructor(intervals: string[]) {
		this.intervalNames = intervals;
	}

	from(item: Note|string) {
		const note = toObject(item, toNote)
		return new NoteCollection(this.intervalNames.map(function(d) {
			if (d === 'R') d = 'P1';
			return note.up(d);
		}))
	}

}

function toNote(item: Note|string) {
	if (isString(item)) {
		return new Note(item);
	} else {
		return item;
	}
}

export default Pattern;



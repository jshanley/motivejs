# motive [![NPM version](https://badge.fury.io/js/motive.png)](http://badge.fury.io/js/motive)

> JavaScript music theory library

## Install and Use
### node:
```
npm install motive
```
```javascript
var motive = require('motive');
```
### browser:
```html
<script src="path/to/motive.min.js"></script>
```

This will create a global variable `motive`.

alternatively, you can require `motive.js` or `motive.min.js` as an AMD module.

## Examples

_**update 0.2.1** you now have direct access to the `Note`, `Interval` and `Chord` classes so they can be extended. These can be found under `motive.constructors`._

create a note:
```javascript
var myNote = motive.note('Bb');
// you now have some info about your note
myNote.type;               // 'note'
myNote.pitchClass;         // 10
myNote.isEnharmonic('A#'); // true
myNote.intervalFrom('Eb'); // 'P5'
myNote.intervalTo('C');    // 'M2'
```

set the note's octave to make it an exact pitch:
```javascript
myNote.setOctave(3);
// now that it's a pitch you have some additional info
myNote.type;           // 'pitch'
myNote.midi;           // 58
myNote.frequency;      // 233.0818....
```

make a new note by transposing:
```javascript
var otherNote = myNote.up('P5');
// this creates a new note up a perfect fifth from your first note
otherNote.name;        // 'F'
otherNote.octave;      // 4
```

create a chord:
```javascript
var myChord = motive.chord('Dm7');
// the root is a motive.Note object
myChord.root;     // '[note D]'
myChord.intervals;     // [ 'R', 'm3', 'P5', 'm7' ]
// this is an array of motive.Note objects representing the members
myChord.notes;   // [ '[note D]', '[note F]', '[note A]', '[note C]' ]
```
## License
Copyright (c) 2014 John Shanley.

Licensed under the [MIT license](LICENSE-MIT).

Project created by [John Shanley](https://github.com/jshanley).

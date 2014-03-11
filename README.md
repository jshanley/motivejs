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

Browser builds can be found in the 'standalone' directory of this repo.
```html
<script src="path/to/motive.min.js"></script>
```

This will create a global variable `motive`.

_TODO: make an AMD build for use with RequireJS_

## Examples

_create a note:_
```javascript
var myNote = motive.note('Bb');
myNote.type;               // 'note'
myNote.pitchClass;         // 10
myNote.isEnharmonic('A#'); // true
myNote.intervalFrom('Eb'); // 'P5'
myNote.intervalTo('C');    // 'M2'
```

_set the note's octave to make it a pitch:_
```javascript
myNote.setOctave(3);
myNote.type;           // 'pitch'
myNote.midi;           // 58
myNote.frequency;      // 233.0818....
```

_make a new note by transposing:_
```javascript
var otherNote = myNote.up('P5');

otherNote.name;        // 'F'
otherNote.octave;      // 4
```

_create a chord:_
```javascript
var myChord = motive.chord('Dm7');
myChord.root.name;     // 'D'
myChord.intervals;     // [ 'R', 'm3', 'P5', 'm7' ]
myChord.notes;         // [ 'D', 'F', 'A', 'C' ]
```
## License
Copyright (c) 2014 John Shanley.

Licensed under the [MIT license](LICENSE-MIT).


***

Project created by [John Shanley](https://github.com/jshanley).

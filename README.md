# MotiveJS

> JavaScript music theory library

### [Visit the docs →](http://johnshanley.github.io/motivejs)

## Examples

_create a note:_
```javascript
var myNote = motive.note('Bb');

myNote.pitchClass;     // 10
myNote.isEnharmonic('A#'); // true
```

_set the note's octave:_
```javascript
myNote.setOctave(3);
myNote.midi;           // 58
myNote.frequency;      // 233.0818....
```

_make a new note by transposing:_
```javascript
var otherNote = myNote.up('P5');

otherNote.name;        // 'F'
otherNote.octave;      // 4
```

## License
Copyright (c) 2014 John Shanley
Licensed under the [MIT license](LICENSE-MIT).


***

Project created by [John Shanley](https://github.com/johnshanley).

## Important Concepts

### Input Validation and Parsing

The first step when creating an object such as `motive.note` or `motive.chord` is to run the input string through validation.

Validation for each type is found at `regex.validation.<type>`, for example chord names can be validated using `regex.validation.chordName('Am6')`

The validation ensures that a properly formatted string was given as input.

The validation process also splits the input string into component parts. Since these parts may also be useful later on, they can be sent back after validation.

For an example, this is how validation is done for chord names:

``` javascript
var parsed = regex.validate.chordName(chord_name).parse();
if (!parsed) {
  throw new Error('Invalid chord name.');
}
```

`regex.validate.chordName(chord_name)` returns an object with two methods:

`.valid()` simply returns a boolean representing whether or not the string is valid.

`.parse()` splits the input into its component parts, and returns them as an object, or else returns `false` if the input is not valid.

By storing the return value from the `.parse()` method in the variable `parsed` we can access the properties:

`parsed.root` - the root of the chord.

`parsed.species` - the basic type of chord.

`parsed.alterations` - alterations to the basic type.

`parsed.slash` - either `'/'` or `''` depending on the presence of a slash chord.

`parsed.bass` - either the bass note following the slash or `''`.

### Fifths

Many objects created by this library have a property called `fifths`. This is an integer value that is used for consistent arithmetic within and between different types.

#### for Note Names

The simplest usage of fifths is for note names. Each note name has a specific fifths value, defined as the number of sharps (positive) or flats (negative) in that note's key signature. In other words, if a major scale was built from that root note, how many sharps or flats would it have?

This is essential for keeping enharmonic notes from being confused, as the fifths values will be unique.

For example, the fifths value of **E** is 4, because E-major has 4 sharps. The note **Fb** is enharmonically equivalent to **E**, but its fifths value is -8, because Fb-major contains 6 flats and one double flat, making 8.

#### for Intervals

Fifths can also be assigned as a value for simple intervals (those which are contained within an octave). In this case the value literally represents the number of fifths up (positive) or down (negative) it would take to span the generalized interval (generalized meaning disregarding octave displacement).

Consider the interval of a major-3rd or M3:

How many fifths are in a generalized M3? Lets begin at **C**, so our target note is the major-3rd **E**.

Ascending in fifths from **C**, we get: **G**, **D**, **A**, **E**

so the M3 is considered to have a value of 4 fifths.

#### Putting them together...

As you may have noticed, this is similar to the calculation we were making for Note Names. In fact, another way to define the fifths value for note names would be to determine the number of fifths the note is away from **C**, which turns out to be the same number as the number of flats or sharps in its key signature.

In this way, the different types can be operated on arithmetically while keeping the musical spelling (eg. E vs Fb) consistent.

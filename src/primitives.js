var pitch_classes = [
    { value: 0,     natural: 'C',   flat: null, sharp: 'B#',    dblflat: 'Dbb',     dblsharp: null, common: 'C' },
    { value: 1,     natural: null,  flat: 'Db', sharp: 'C#',    dblflat: null,      dblsharp: 'Bx', common: 'C#' },
    { value: 2,     natural: 'D',   flat: null, sharp: null,    dblflat: 'Ebb',     dblsharp: 'Cx', common: 'D' },
    { value: 3,     natural: null,  flat: 'Eb', sharp: 'D#',    dblflat: 'Fbb',     dblsharp: null, common: 'Eb' },
    { value: 4,     natural: 'E',   flat: 'Fb', sharp: null,    dblflat: null,      dblsharp: 'Dx', common: 'E' },
    { value: 5,     natural: 'F',   flat: null, sharp: 'E#',    dblflat: 'Gbb',     dblsharp: null, common: 'F' },
    { value: 6,     natural: null,  flat: 'Gb', sharp: 'F#',    dblflat: null,      dblsharp: 'Ex', common: 'F#' },
    { value: 7,     natural: 'G',   flat: null, sharp: null,    dblflat: 'Abb',     dblsharp: 'Fx', common: 'G' },
    { value: 8,     natural: null,  flat: 'Ab', sharp: 'G#',    dblflat: null,      dblsharp: null, common: 'Ab' },
    { value: 9,     natural: 'A',   flat: null, sharp: null,    dblflat: 'Bbb',     dblsharp: 'Gx', common: 'A' },
    { value: 10,    natural: null,  flat: 'Bb', sharp: 'A#',    dblflat: 'Cbb',     dblsharp: null, common: 'Bb' },
    { value: 11,    natural: 'B',   flat: 'Cb', sharp: null,    dblflat: null,      dblsharp: 'Ax', common: 'B' }
];
var steps = [
    { name: 'C', value: 60 },
    { name: 'D', value: 62 },
    { name: 'E', value: 64 },
    { name: 'F', value: 65 },
    { name: 'G', value: 67 },
    { name: 'A', value: 69 },
    { name: 'B', value: 71 }
];
var operators = [
    { name: 'b',    value: -1 },
    { name: '#',    value: 1 },
    { name: 'bb',   value: -2 },
    { name: 'x',    value: 2 }
];
var keys = [
    { fifths: 0,    major: 'C',     minor: 'A'  },
    { fifths: 1,    major: 'G',     minor: 'E'  },
    { fifths: -1,   major: 'F',     minor: 'D'  },
    { fifths: 2,    major: 'D',     minor: 'B'  },
    { fifths: -2,   major: 'Bb',    minor: 'G'  },
    { fifths: 3,    major: 'A',     minor: 'F#' },
    { fifths: -3,   major: 'Eb',    minor: 'C'  },
    { fifths: 4,    major: 'E',     minor: 'C#' },
    { fifths: -4,   major: 'Ab',    minor: 'F'  },
    { fifths: 5,    major: 'B',     minor: 'G#' },
    { fifths: -5,   major: 'Db',    minor: 'Bb' },
    { fifths: 6,    major: 'F#',    minor: 'D#' },
    { fifths: -6,   major: 'Gb',    minor: 'Eb' },
    { fifths: 7,    major: 'C#',    minor: 'A#' },
    { fifths: -7,   major: 'Cb',    minor: 'Ab' }
];
var simple_intervals = [
    { name: 'm2',   semitones: 1,   steps: 1 },
    { name: 'M2',   semitones: 2,   steps: 1 },
    { name: 'm3',   semitones: 3,   steps: 2 },
    { name: 'M3',   semitones: 4,   steps: 2 },
    { name: 'P4',   semitones: 5,   steps: 3 },
    { name: 'A4',   semitones: 6,   steps: 3 },
    { name: 'd5',   semitones: 6,   steps: 4 },
    { name: 'P5',   semitones: 7,   steps: 4 },
    { name: 'm6',   semitones: 8,   steps: 5 },
    { name: 'M6',   semitones: 9,   steps: 5 },
    { name: 'm7',   semitones: 10,  steps: 6 },
    { name: 'M7',   semitones: 11,  steps: 6 }
];
var intervals = [
    { name: 'U',    semitones: 0,   steps: 0 },
    { name: 'm2',   semitones: 1,   steps: 1 },
    { name: 'M2',   semitones: 2,   steps: 1 },
    { name: 'A2',   semitones: 3,   steps: 1 },
    { name: 'd3',   semitones: 2,   steps: 2 },
    { name: 'm3',   semitones: 3,   steps: 2 },
    { name: 'M3',   semitones: 4,   steps: 2 },
    { name: 'd4',   semitones: 4,   steps: 3 },
    { name: 'P4',   semitones: 5,   steps: 3 },
    { name: 'A4',   semitones: 6,   steps: 3 },
    { name: 'd5',   semitones: 6,   steps: 4 },
    { name: 'P5',   semitones: 7,   steps: 4 },
    { name: 'A5',   semitones: 8,   steps: 4 },
    { name: 'm6',   semitones: 8,   steps: 5 },
    { name: 'M6',   semitones: 9,   steps: 5 },
    { name: 'A6',   semitones: 10,  steps: 5 },
    { name: 'd7',   semitones: 9,   steps: 6 },
    { name: 'm7',   semitones: 10,  steps: 6 },
    { name: 'M7',   semitones: 11,  steps: 6 },
    { name: 'P8',   semitones: 12,  steps: 7 },

    { name: 'm9',   semitones: 13,  steps: 8 },
    { name: 'M9',   semitones: 14,  steps: 8 },
    { name: 'A9',   semitones: 15,  steps: 8 },
    { name: 'd11',  semitones: 16,  steps: 10 },
    { name: 'P11',  semitones: 17,  steps: 10 },
    { name: 'A11',  semitones: 18,  steps: 10 },
    { name: 'm13',  semitones: 20,  steps: 12 },
    { name: 'M13',  semitones: 21,  steps: 12 },
    { name: 'A13',  semitones: 22,  steps: 12 }
];
var scales = [
    { name: 'major',        intervals: ['R','M2','M3','P4','P5','M6','M7'], pattern: [2,2,1,2,2,2,1] },
    { name: 'minor',        intervals: ['R','M2','m3','P4','P5','m6','m7'], pattern: [2,1,2,2,1,2,2], source: ['major', 'up', 'm3'] },

    { name: 'major pentatonic', intervals: ['R','M2','M3','P5','M6'], pattern: [2,2,3,2,3] },
    { name: 'minor pentatonic', intervals: ['R','m3','P4','P5','m7'], pattern: [3,2,2,3,2], source: ['major pentatonic', 'up', 'm3'] },

    { name: 'ionian',       intervals: ['R','M2','M3','P4','P5','M6','M7'], pattern: [2,2,1,2,2,2,1] },
    { name: 'dorian',       intervals: ['R','M2','m3','P4','P5','M6','m7'], pattern: [2,1,2,2,2,1,2], source: ['major', 'down', 'M2'] },
    { name: 'phrygian',     intervals: ['R','m2','m3','P4','P5','m6','m7'], pattern: [1,2,2,2,1,2,2], source: ['major', 'down', 'M3'] },
    { name: 'lydian',       intervals: ['R','M2','M3','A4','P5','M6','M7'], pattern: [2,2,2,1,2,2,1], source: ['major', 'down', 'P4'] },
    { name: 'mixolydian',   intervals: ['R','M2','M3','P4','P5','M6','m7'], pattern: [2,2,1,2,2,1,2], source: ['major', 'up', 'P4'] },
    { name: 'aeolian',      intervals: ['R','M2','m3','P4','P5','m6','m7'], pattern: [2,1,2,2,1,2,2], source: ['major', 'up', 'm3'] },
    { name: 'locrian',      intervals: ['R','m2','m3','P4','d5','m6','m7'], pattern: [1,2,2,1,2,2,2], source: ['major', 'up', 'm2'] },

    { name: 'melodic minor',    intervals: ['R','M2','m3','P4','P5','M6','M7'], pattern: [2,1,2,2,2,2,1] },
    { name: 'dorian b2',        intervals: ['R','m2','m3','P4','P5','M6','m7'], pattern: [1,2,2,2,2,1,2], source: ['melodic minor', 'down', 'M2'] },
    { name: 'lydian #5',        intervals: ['R','M2','M3','A4','A5','M6','M7'], pattern: [2,2,2,2,1,2,1], source: ['melodic minor', 'down', 'm3'] },
    { name: 'lydian dominant',  intervals: ['R','M2','M3','A4','P5','M6','m7'], pattern: [2,2,2,1,2,1,2], source: ['melodic minor', 'down', 'P4'] },
    { name: 'mixolydian b6',    intervals: ['R','M2','M3','P4','P5','m6','m7'], pattern: [2,2,1,2,1,2,2], source: ['melodic minor', 'up', 'P4'] },
    { name: 'aeolian b5',       intervals: ['R','M2','m3','P4','d5','m6','m7'], pattern: [2,1,2,1,2,2,2], source: ['melodic minor', 'up', 'm3'] },
    { name: 'altered',          intervals: ['R','m2','m3','d4','d5','m6','m7'], pattern: [1,2,1,2,2,2,2], source: ['melodic minor', 'up', 'm2'] },

    { name: 'harmonic minor',   intervals: ['R','M2','m3','P4','P5','m6','M7'], pattern: [2,1,2,2,1,3,1] },

    { name: 'diminished',       intervals: ['R','M2','m3','P4','d5','m6','M6','M7'], pattern: [2,1,2,1,2,1,2,1] },
    { name: 'half-whole diminished', intervals: ['R','m2','m3','M3','A4','P5','M6','m7'], pattern: [1,2,1,2,1,2,1,2] },
    { name: 'whole-half diminished', intervals: ['R','M2','m3','P4','d5','m6','M6','M7'], pattern: [2,1,2,1,2,1,2,1] },

    { name: 'whole tone',       intervals: ['R','M2','M3','A4','A5','m7'], pattern: [2,2,2,2,2,2] }
];
var tetrachords = [
    { name: 'ionian',           pattern: [2,2,1] },
    { name: 'dorian',           pattern: [2,1,2] },
    { name: 'phrygian',         pattern: [1,2,2] },
    { name: 'lydian',           pattern: [2,2,2] },
    { name: 'hungarian major',  pattern: [3,1,2] },
    { name: 'spanish phrygian', pattern: [1,2,1] },
    { name: 'hungarian minor',  pattern: [2,1,3] },
    { name: 'harmonic',         pattern: [1,3,1] }
];
primitives.scales = [
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
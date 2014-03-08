// load polyfills
require('./utilities/polyfills');

// this will be the global object
module.exports = {
    note: require('./note/note'),
    chord: require('./chord/jazz'),
    palette: require('./palette/palette')
};

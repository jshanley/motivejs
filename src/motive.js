// load polyfills
require('./utilities/polyfills');

// this will be the global object
module.exports = {
    note: require('./note/note')
};

// load polyfills
require('./utilities/polyfills');

// load base modules
var note = require('./note');


// this will be the global object
module.exports = {
    note: note
};
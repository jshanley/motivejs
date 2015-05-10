var highlight = require('../node_modules/highlight.js/lib/highlight');
var js = require('../node_modules/highlight.js/lib/languages/javascript');

highlight.registerLanguage('javascript', js);

highlight.initHighlightingOnLoad();

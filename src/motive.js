// this will be the global object
module.exports = {
  version: require('../package.json').version,
  note: require('./note/note'),
  chord: require('./chord/jazz'),
  interval: require('./interval/interval'),
  palette: require('./palette/palette')
};

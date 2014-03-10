function Palette(item) {
  this.notes = [];
  this.type = 'palette';
  if (typeof item !== 'undefined') {
    this.add(item);
  }
}
Palette.prototype.add = function(item) {
  if (item.type === 'note') {
    this.notes.push(item);
    return;
  }
  if (item.type === 'chord') {
    for (var i = 0; i < item.notes.length; i++) {
     var inThis = false;
     for (var t = 0; t < this.notes.length; t++) {
       if (this.notes[t].isEquivalent(item.notes[i])) {
         inThis = true;
         break;
       }
     }
     if (!inThis) {
       this.notes.push(item.notes[i]);
     }
    }
    return;
  }
};

module.exports = function(item) {
  return new Palette(item);
};

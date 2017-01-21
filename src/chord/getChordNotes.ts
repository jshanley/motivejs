import "../note_collection/";

function getChordNotes(intervals, root) {
  var output = [];
  output.push(root);
  for (var i = 1; i < intervals.length; i++) {
    output.push(root.up(intervals[i]));
  }
  return motive.noteCollection(output);
}

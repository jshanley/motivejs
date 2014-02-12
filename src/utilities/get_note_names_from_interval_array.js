utilities.getNoteNamesFromIntervalArray = function(root, interval_array) {
    try {
        var output = [];
        var notenames = [];
        for(var i = 0; i < interval_array.length; i++) {
            if (interval_array[i] === 'R') {
                notenames.push(root);
            } else {
                notenames.push(utilities.transpose(root, 'up', interval_array[i]));
            }
        }
        for(var n = 0; n < notenames.length; n++){
            output.push(notenames[n]);
        }
        return output;
    }
    catch(err) {
        MotiveError(err);
    }
};
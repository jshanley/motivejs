utilities.transpose = function(pitch_name, direction, interval){
    if(interval === 'U' || interval === 'R'){
        return pitch_name;
    }
    if (direction !== 'up' && direction !== 'down') {
        return pitch_name;
    }

    var step = pitch_name.replace(/([A-G]).*/, '$1');
    var input_operator = pitch_name.replace(/[A-G](.*)/, '$1');
    var alter = 0;
    if(input_operator) {
        for(var o = 0; o < primitives.operators.length; o++){
            if (input_operator === primitives.operators[o].name){
                alter = primitives.operators[o].value;
                break;
            }
        }
    }
    var step_index, input_value;
    for (var s = 0; s < primitives.steps.length; s++) {
        if (step === primitives.steps[s].name) {
            step_index = s;
            input_value = (primitives.steps[s].value + alter) % 12;
            break;
        }
    }
    var interval_value, interval_steps;
    for (var i = 0; i < primitives.intervals.length; i++) {
        if (interval === primitives.intervals[i].name) {
            interval_value = primitives.intervals[i].semitones;
            interval_steps = primitives.intervals[i].steps;
            break;
        }
    }
    var target_step_index, target_value;
    switch(direction){
        case 'up': {
            target_step_index = (step_index + interval_steps) % 7;
            target_value = (input_value + interval_value) % 12;
        }
        break;
        case 'down': {
            target_step_index = (7 + (step_index - interval_steps)) % 7;
            target_value = (12 + (input_value - interval_value)) % 12;
        }
        break;
    }
    if (target_value === (12 + primitives.steps[target_step_index].value) % 12) {
        return primitives.steps[target_step_index].name;
    } else {
        for (var op = 0; op < primitives.operators.length; op++) {
            if (target_value === (12 + primitives.steps[target_step_index].value + primitives.operators[op].value) % 12) {
                return primitives.steps[target_step_index].name + primitives.operators[op].name;
            }
        }
    }
};
function minToTime(time) {
    if (time > 1440) time -= 1440;
    var AMPM = 'am';
    var minutes = time % 60;
    var hour = Math.floor(time / 60);

    // rounding for pretty display
    if (minutes % 10 >= 5) {
        minutes += (10 - (minutes % 10));
        if (minutes == 60) {
            minutes = 0;
            hour += 1;
        }
    } else if (minutes % 10 != 0) {
        minutes += (5 - (minutes % 10));
    }

    if (hour >= 12) {
        AMPM = 'pm';
        if (hour > 12) {
            hour -= 12;
        }
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return hour + ":" + minutes + AMPM;
}

function readMinutes(time) {
    var h = ' hour';
    var hs = '';
    var m = ' minute';
    var ms = '';

    var hour = Math.floor(time / 60);
    var minutes = time % 60;

    if (minutes > 1) {
        ms = 's';
    }
    if (hour > 1) {
        hs = 's';
    }

    if (hour == 0) {
        return minutes + m + ms;
    } else {
        if (minutes == 0) {
            return hour + h + hs;
        } else {
            return hour + h + hs + ' and ' + minutes + m + ms;
        }
    }
}

function constraint(category, unit, compare, value) {
    this.cat = category;
    this.unit = unit;
    this.compare = compare;
    this.value = value;
}

function predicateResponse(response, value, activities, explain) {
    this.response = response;
    this.value = value;
    this.activities = activities;
    this.explain = explain;
}

function activity(name, description, commentary, location, subactivities, duration, categories) {
    this.name = name;
    this.description = description;
    this.commentary = commentary;
    this.location = location;
    this.subactivities = subactivities;
    this.duration = duration;
    this.categories = categories;
}

function note(name, description, categories) {
    this.name = name;
    this.description = description;
    this.categories = categories;
}

function campuslocation(vlabel, data) {
    this.label = vlabel;
    this.data = data;
}

function streamitem(type, data, time) {
    this.type = type;
    this.data = data;
    if (time == null) {
        var t = new Date();
        this.createTime = t.getTime();
    } else {
        this.createTime = time;
    }
    this.value = data.name;
    this.label = [data.name, data.description, data.categories.join(' ')].join(' ');
    this.data.start = calBegin; // for calendar
}

function locationInfo(name, lat, long) {
    this.name = name;
    this.lat = lat;
    this.long = long;
}
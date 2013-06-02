
function constraint(category, unit, compare, value) {
    this.cat = category;
    this.unit = unit;
    this.compare = compare;
    this.value = value;
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
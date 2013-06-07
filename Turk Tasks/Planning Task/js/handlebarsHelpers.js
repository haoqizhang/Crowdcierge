(function registerHandlebarsHelpers() {
	Handlebars.registerHelper('shorten', function(string) {
		return takeTill(string, 100);
	});
}).call(this);
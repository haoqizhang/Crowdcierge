(function registerHandlebarsHelpers() {
  Handlebars.registerHelper('shorten', function(string) {
    return takeTill(string, 100);
  });

  Handlebars.registerHelper('minToPrettyTime', function(string) {
    var totalMinutes = parseInt(string);
    var hours = Math.floor(totalMinutes/60);
    var minutes = totalMinutes % 60;
    return hours + 'hr ' + minutes + 'min'
  });

  function rtrim(stt) {
    return stt.replace(/\s+$/, "");
  }

  function takeTill(str, maxchars) {
    var str = rtrim(str.replace(/<br\/>/g, ' '));

    var sp = str.split(' ');
    var o = '';
    for (var i = 0; i < sp.length; i++) {
        if (o.length + sp[i].length > maxchars) {
            var ret = rtrim(o) + ' [...]';
            return ret;
        } else {
            o += sp[i];
            o += ' ';
        }
    }
    return rtrim(str);
  }
  
}).call(this);
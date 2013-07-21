(function() {
  var _this = this;

  module.exports.bindHandlers = (function(app) {
    app.get('/trips', function(req, res) {
      return res.send('TODO');
    });
    return app.post('/trips', function(req, res) {
      return res.send('TODO');
    });
  });

}).call(this);

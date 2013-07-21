(function() {
  var AuthDAO, authDAO,
    _this = this;

  AuthDAO = require('./AuthDAO');

  authDAO = new AuthDAO();

  module.exports.bindHandlers = (function(app) {
    app.get('/users', function(req, res) {
      if (req.body.login != null) {
        return authDAO.loginUser(req.body, function(id) {
          return res.send(id.toString());
        });
      } else {
        return authDAO.getAllUsers(function(users) {
          return res.send(users);
        });
      }
    });
    return app.post('/users', function(req, res) {
      var data;
      data = req.body;
      return authDAO.createUser(data, function(id) {
        return res.send(id.toString());
      });
    });
  });

}).call(this);

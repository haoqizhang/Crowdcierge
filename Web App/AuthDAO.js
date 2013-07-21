(function() {
  var AuthDAO, CREATE_USER, MysqlDAO, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CREATE_USER = "insert into users (email, password) values ('%s', '%s')";

  MysqlDAO = require('./MysqlDAO');

  AuthDAO = (function(_super) {
    __extends(AuthDAO, _super);

    function AuthDAO() {
      this.getAllUsers = __bind(this.getAllUsers, this);
      this.loginUser = __bind(this.loginUser, this);
      this.createUser = __bind(this.createUser, this);
      _ref = AuthDAO.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AuthDAO.prototype.createUser = function(data, callback) {
      var values,
        _this = this;
      values = [];
      values.push(data.email);
      values.push('NoPassword');
      return this.executeQuery(CREATE_USER, values, (function(rows, fields) {
        return callback(rows.insertId);
      }));
    };

    AuthDAO.prototype.loginUser = function(data, callback) {
      return callback('TODO');
    };

    AuthDAO.prototype.getAllUsers = function(data, callback) {
      return callback('TODO');
    };

    return AuthDAO;

  })(MysqlDAO);

  module.exports = AuthDAO;

}).call(this);

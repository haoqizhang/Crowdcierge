(function() {
  var MysqlDAO, connection, format, mysql,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  mysql = require('mysql');

  connection = mysql.createConnection({
    host: 'mysql.csail.mit.edu',
    user: 'jrafidi',
    password: 'crowdcierge',
    database: 'crowdcierge'
  });

  format = require('format');

  MysqlDAO = (function() {
    function MysqlDAO() {
      this.executeQuery = __bind(this.executeQuery, this);
    }

    mysql = require('mysql');

    MysqlDAO.prototype.executeQuery = function(query, values, callback) {
      var interpolatedQuery,
        _this = this;
      connection.connect();
      interpolatedQuery = format.vsprintf(query, values);
      connection.query(interpolatedQuery, (function(err, rows, fields) {
        if (err) {
          console.log("Error on SQL query " + interpolatedQuery);
          throw err;
        } else {
          return typeof callback === "function" ? callback(rows, fields) : void 0;
        }
      }));
      return connection.end();
    };

    return MysqlDAO;

  })();

  module.exports = MysqlDAO;

}).call(this);

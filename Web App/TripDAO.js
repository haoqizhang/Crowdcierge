(function() {
  var CREATE_TRIP, MysqlDAO, TripDAO, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CREATE_TRIP = "insert into trips (";

  MysqlDAO = require('./MysqlDAO');

  TripDAO = (function(_super) {
    __extends(TripDAO, _super);

    function TripDAO() {
      this.createTrip = __bind(this.createTrip, this);
      _ref = TripDAO.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TripDAO.prototype.createTrip = function(data) {
      var key, val, values;
      return values = (function() {
        var _results;
        _results = [];
        for (key in data) {
          val = data[key];
          _results.push(JSON.stringify(val));
        }
        return _results;
      })();
    };

    return TripDAO;

  })(MysqlDAO);

}).call(this);

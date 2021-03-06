(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var _STATE_LOAD_URL;
    _STATE_LOAD_URL = "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/loadTurkTourTaskState.php";
    return com.uid.crowdcierge.StateLoader = (function() {
      function StateLoader(options) {
        this._processAdmin = __bind(this._processAdmin, this);
        this._processState = __bind(this._processState, this);
        this.load = __bind(this.load, this);
        this.session = options.session;
        this.currentTaskModel = this.session.currentTaskModel;
        this.itineraryModel = this.session.itineraryModel;
        this.constraintsModel = this.session.constraintsModel;
        this.activitiesModel = this.session.activitiesModel;
      }

      StateLoader.prototype.load = function() {
        var _this = this;
        if (this.currentTaskModel.get('tid') == null) {
          console.error('No tid param set');
          return;
        }
        return $.ajax({
          type: 'GET',
          dataType: 'json',
          url: _STATE_LOAD_URL,
          data: {
            type: 'turktour',
            id: this.currentTaskModel.get('tid')
          },
          async: false,
          success: (function(obj) {
            return _this._processState(obj);
          })
        });
      };

      StateLoader.prototype._processState = function(meta) {
        var activity, i, itinerary, itineraryTimes, _i, _ref;
        this.currentTaskModel.set('state', JSON.parse(meta.state));
        this.currentTaskModel.set('stateId', meta.stateId);
        meta.state = JSON.parse(meta.state);
        itinerary = meta.state.itinerary;
        itineraryTimes = meta.state.itineraryTimes;
        for (i = _i = 0, _ref = itinerary.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (itinerary[i].toString().indexOf('user') !== -1) {
            itinerary[i] = itinerary[i].toString().substring(5);
          }
          activity = this.activitiesModel.get('items').get(itinerary[i]);
          this.itineraryModel.push(activity);
        }
        this.itineraryModel.sort();
        return this._processAdmin(meta.state.admin);
      };

      StateLoader.prototype._processAdmin = function(admin) {
        var con, constraintModel, _i, _len, _ref, _results;
        this.currentTaskModel.set(admin);
        if (this.currentTaskModel.get('city') == null) {
          this.currentTaskModel.set('city', admin.name.substring(9));
        }
        _ref = admin.constraints;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          con = _ref[_i];
          constraintModel = new com.uid.crowdcierge.Constraint(con);
          _results.push(this.constraintsModel.push(constraintModel));
        }
        return _results;
      };

      return StateLoader;

    })();
  })();

}).call(this);

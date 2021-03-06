(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ACTIVITY_ICON, _CIRCLE_MARKER_SIZE, _ROUTE_KEY, _ROUTE_LOAD_URL, _ref;
    _CIRCLE_MARKER_SIZE = 20;
    _ACTIVITY_ICON = L.icon({
      iconUrl: '../img/Custom-Icon-Design-Pretty-Office-9-Circle.ico',
      iconSize: [_CIRCLE_MARKER_SIZE - 7, _CIRCLE_MARKER_SIZE - 7]
    });
    _ROUTE_LOAD_URL = 'https://dev.virtualearth.net/REST/v1/Routes/Walking';
    _ROUTE_KEY = 'AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp';
    return com.uid.crowdcierge.MapView = (function(_super) {
      __extends(MapView, _super);

      function MapView() {
        this._getRoute = __bind(this._getRoute, this);
        this._handleRemoveItemClick = __bind(this._handleRemoveItemClick, this);
        this._handleAddItemClick = __bind(this._handleAddItemClick, this);
        this._handleEditItemClick = __bind(this._handleEditItemClick, this);
        this._handleViewItemClick = __bind(this._handleViewItemClick, this);
        this._getActivityPopupFromModel = __bind(this._getActivityPopupFromModel, this);
        this._showSelectedActivity = __bind(this._showSelectedActivity, this);
        this._plotActivitySuggestions = __bind(this._plotActivitySuggestions, this);
        this._processRouteData = __bind(this._processRouteData, this);
        this._plotItineraryRoute = __bind(this._plotItineraryRoute, this);
        this._plotItineraryPins = __bind(this._plotItineraryPins, this);
        this._plotItinerary = __bind(this._plotItinerary, this);
        this._plotStartEnd = __bind(this._plotStartEnd, this);
        this._clearMapActivityMarkers = __bind(this._clearMapActivityMarkers, this);
        this._replotMap = __bind(this._replotMap, this);
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        _ref = MapView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      MapView.prototype.className = 'map-view';

      MapView.prototype.initialize = function() {
        this.session = this.options.session;
        this.activitiesModel = this.session.activitiesModel;
        this.itineraryModel = this.session.itineraryModel;
        this.currentTaskModel = this.session.currentTaskModel;
        this.idToMarkerMap = {};
        this.routeLines = [];
        this.listenTo(this.itineraryModel, 'add sort remove reset', this._replotMap);
        this.listenTo(this.activitiesModel.get('items'), 'add', this._replotMap);
        return this.listenTo(this.activitiesModel, 'change:selected', this._showSelectedActivity);
      };

      MapView.prototype.render = function() {
        var source, template;
        this.$el.empty();
        source = $('#map-view-template').html();
        template = Handlebars.compile(source);
        this.$el.html(template());
        this.map = L.map(this.$('#map')[0]);
        L.tileLayer('http://{s}.tile.cloudmade.com/ebeae5620c954242916bfba0601e86d8/99953/256/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
        }).addTo(this.map);
        this._plotStartEnd();
        return this._replotMap();
      };

      MapView.prototype._replotMap = function() {
        this._clearMapActivityMarkers();
        this._plotItinerary();
        return this._plotActivitySuggestions();
      };

      MapView.prototype._clearMapActivityMarkers = function() {
        var marker, _i, _len, _ref1;
        _ref1 = _.values(this.idToMarkerMap);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          marker = _ref1[_i];
          this.map.removeLayer(marker);
        }
        return this.idToMarkerMap = {};
      };

      MapView.prototype._plotStartEnd = function() {
        var endIcon, endLoc, endMarker, startIcon, startLoc, startMarker;
        startLoc = this.currentTaskModel.get('start');
        this.map.setView([startLoc.lat, startLoc.long], 13, true);
        startIcon = L.divIcon({
          className: 'start-marker',
          iconSize: [_CIRCLE_MARKER_SIZE, _CIRCLE_MARKER_SIZE]
        });
        startMarker = L.marker([startLoc.lat, startLoc.long], {
          icon: startIcon,
          zIndexOffset: 100
        });
        startMarker.bindPopup('Traveler\'s starting location');
        startMarker.addTo(this.map);
        endLoc = this.currentTaskModel.get('end');
        endIcon = L.divIcon({
          className: 'end-marker',
          iconSize: [_CIRCLE_MARKER_SIZE, _CIRCLE_MARKER_SIZE]
        });
        endMarker = L.marker([endLoc.lat - 0.0001, endLoc.long - 0.0001], {
          icon: endIcon
        });
        endMarker.bindPopup('Traveler\'s ending location');
        return endMarker.addTo(this.map);
      };

      MapView.prototype._plotItinerary = function() {
        this._plotItineraryPins();
        return this._plotItineraryRoute();
      };

      MapView.prototype._plotItineraryPins = function() {
        var i, marker, model, _i, _len, _ref1, _results;
        _ref1 = this.itineraryModel.models;
        _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          model = _ref1[i];
          marker = L.marker([model.get('location').lat, model.get('location').long], {
            icon: new L.NumberedDivIcon({
              number: i + 1
            }),
            zIndexOffset: 1000
          });
          this.idToMarkerMap[model.cid] = marker;
          marker.bindPopup(this._getActivityPopupFromModel(model));
          _results.push(marker.addTo(this.map));
        }
        return _results;
      };

      MapView.prototype._plotItineraryRoute = function() {
        var act, callback, i, line, locations, _i, _j, _len, _ref1, _ref2, _results,
          _this = this;
        _ref1 = this.routeLines;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          line = _ref1[_i];
          this.map.removeLayer(line);
        }
        locations = (function() {
          var _j, _len1, _ref2, _results;
          _ref2 = this.itineraryModel.models;
          _results = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            act = _ref2[_j];
            _results.push(act.get('location'));
          }
          return _results;
        }).call(this);
        locations.unshift(this.currentTaskModel.get('start'));
        locations.push(this.currentTaskModel.get('end'));
        _results = [];
        for (i = _j = 0, _ref2 = locations.length - 2; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
          callback = (function(index) {
            return (function(obj) {
              return _this._processRouteData(index, obj);
            });
          });
          _results.push(this._getRoute(locations[i], locations[i + 1], callback(i)));
        }
        return _results;
      };

      MapView.prototype._processRouteData = function(index, data) {
        var lineData, polyline;
        lineData = data.resourceSets[0].resources[0].routePath.line.coordinates;
        polyline = L.polyline(lineData, {
          color: 'blue'
        });
        polyline.addTo(this.map);
        return this.routeLines.push(polyline);
      };

      MapView.prototype._plotActivitySuggestions = function() {
        var activity, i, marker, _i, _len, _ref1, _results;
        _ref1 = this.activitiesModel.get('items').models;
        _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          activity = _ref1[i];
          if (this.itineraryModel.get(activity.cid)) {
            continue;
          }
          marker = L.marker([activity.get('location').lat, activity.get('location').long], {
            icon: _ACTIVITY_ICON,
            zIndexOffset: 200
          });
          this.idToMarkerMap[activity.cid] = marker;
          marker.bindPopup(this._getActivityPopupFromModel(activity));
          _results.push(marker.addTo(this.map));
        }
        return _results;
      };

      MapView.prototype._showSelectedActivity = function(list, activity) {
        if (activity !== null) {
          return this.idToMarkerMap[activity.cid].openPopup();
        }
      };

      MapView.prototype._getActivityPopupFromModel = function(model) {
        var $popup, inItinerary, source, template;
        source = $('#map-popup-template').html();
        template = Handlebars.compile(source);
        inItinerary = this.itineraryModel.get(model.cid) != null;
        $popup = $(template(_.defaults({
          inItinerary: inItinerary
        }, model)));
        $popup.find('.view-item').click(this._handleViewItemClick);
        $popup.find('.edit-item').click(this._handleEditItemClick);
        $popup.find('.add-activity').click(this._handleAddItemClick);
        $popup.find('.remove-activity').click(this._handleRemoveItemClick);
        return $popup[0];
      };

      MapView.prototype._handleViewItemClick = function(evt) {
        var cid, modal;
        cid = $(evt.target).closest('.map-popup').attr('id');
        modal = new com.uid.crowdcierge.ViewActivityModal({
          activity: this.activitiesModel.get('items').get(cid),
          activitiesModel: this.activitiesModel,
          itineraryModel: this.itineraryModel,
          currentTaskModel: this.currentTaskModel
        });
        modal.render();
        return modal.prepMap();
      };

      MapView.prototype._handleEditItemClick = function(evt) {
        var cid, modal;
        cid = $(evt.target).closest('.map-popup').attr('id');
        modal = new com.uid.crowdcierge.EditExistingActivityModal({
          activity: this.activitiesModel.get('items').get(cid),
          activitiesModel: this.activitiesModel,
          itineraryModel: this.itineraryModel,
          currentTaskModel: this.currentTaskModel
        });
        modal.render();
        return modal.prepMap();
      };

      MapView.prototype._handleAddItemClick = function(evt) {
        var cid;
        cid = $(evt.target).closest('.map-popup').attr('id');
        return this.itineraryModel.add(this.activitiesModel.get('items').get(cid));
      };

      MapView.prototype._handleRemoveItemClick = function(evt) {
        var cid;
        cid = $(evt.target).closest('.map-popup').attr('id');
        return this.itineraryModel.remove(cid);
      };

      MapView.prototype._getRoute = function(act1, act2, callback) {
        return $.ajax({
          type: 'GET',
          dataType: 'jsonp',
          jsonp: 'jsonp',
          url: _ROUTE_LOAD_URL,
          data: {
            'waypoint.1': "" + act1.lat + "," + act1.long,
            'waypoint.2': "" + act2.lat + "," + act2.long,
            routePathOutput: 'Points',
            output: 'json',
            timeType: 'Departure',
            dateTime: '3:00:00PM',
            distanceUnit: 'mi',
            key: _ROUTE_KEY
          },
          success: callback
        });
      };

      return MapView;

    })(Backbone.View);
  })();

}).call(this);

// Generated by CoffeeScript 1.6.2
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _CIRCLE_MARKER_SIZE, _ref;

    _CIRCLE_MARKER_SIZE = 20;
    return com.uid.crowdcierge.MapView = (function(_super) {
      __extends(MapView, _super);

      function MapView() {
        this._plotStartEnd = __bind(this._plotStartEnd, this);
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);        _ref = MapView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      MapView.prototype.className = 'map-view';

      MapView.prototype.initialize = function() {
        this.session = this.options.session;
        this.itineraryModel = this.session.itineraryModel;
        return this.currentTaskModel = this.session.currentTaskModel;
      };

      MapView.prototype.render = function() {
        var source, template;

        this.$el.empty();
        source = $('#map-view-template').html();
        template = Handlebars.compile(source);
        this.$el.html(template());
        this.map = L.map(this.$('#map')[0]);
        L.tileLayer('http://{s}.tile.cloudmade.com/ebeae5620c954242916bfba0601e86d8/1/256/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
        }).addTo(this.map);
        return this._plotStartEnd();
      };

      MapView.prototype._plotStartEnd = function() {
        var startIcon, startLoc, startMarker;

        startLoc = this.currentTaskModel.get('start');
        this.map.setView([startLoc.lat, startLoc.long], 15, true);
        startIcon = L.divIcon({
          className: 'start-marker',
          iconSize: [_CIRCLE_MARKER_SIZE, _CIRCLE_MARKER_SIZE]
        });
        startMarker = L.marker([startLoc.lat, startLoc.long], {
          icon: startIcon
        });
        startMarker.bindPopup('Traveler\'s starting location');
        return startMarker.addTo(this.map);
      };

      return MapView;

    })(Backbone.View);
  })();

}).call(this);
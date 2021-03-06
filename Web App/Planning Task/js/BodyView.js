(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ref;
    return com.uid.crowdcierge.BodyView = (function(_super) {
      __extends(BodyView, _super);

      function BodyView() {
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        _ref = BodyView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      BodyView.prototype.className = 'planning-body';

      BodyView.prototype.initialize = function() {
        return this.session = this.options.session;
      };

      BodyView.prototype.render = function() {
        var itineraryView, mapView, streamView;
        this.$el.empty();
        streamView = new com.uid.crowdcierge.StreamView({
          session: this.session
        });
        mapView = new com.uid.crowdcierge.MapView({
          session: this.session
        });
        itineraryView = new com.uid.crowdcierge.ItineraryView({
          session: this.session
        });
        this.$el.append(streamView.$el);
        this.$el.append(mapView.$el);
        this.$el.append(itineraryView.$el);
        streamView.render();
        mapView.render();
        return itineraryView.render();
      };

      return BodyView;

    })(Backbone.View);
  })();

}).call(this);

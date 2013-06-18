// Generated by CoffeeScript 1.6.2
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ref;

    return com.uid.crowdcierge.StreamView = (function(_super) {
      __extends(StreamView, _super);

      function StreamView() {
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);        _ref = StreamView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      StreamView.prototype.className = 'stream-view';

      StreamView.prototype.initialize = function() {
        this.session = this.options.session;
        this.itineraryModel = this.session.itineraryModel;
        this.activitiesModel = this.session.activitiesModel;
        this.constraintsModel = this.session.constraintsModel;
        this.checkItemModel = this.session.checkItemModel;
        return this.currentTaskModel = this.session.currentTaskModel;
      };

      StreamView.prototype.render = function() {
        var source, template;

        this.$el.empty();
        source = $('#stream-view-template').html();
        template = Handlebars.compile(source);
        return this.$el.html(template(this.currentTaskModel.attributes));
      };

      return StreamView;

    })(Backbone.View);
  })();

}).call(this);

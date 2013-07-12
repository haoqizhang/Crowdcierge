(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ref;
    return com.uid.crowdcierge.MainView = (function(_super) {
      __extends(MainView, _super);

      function MainView() {
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        _ref = MainView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      MainView.prototype.className = 'crowdcierge-main';

      MainView.prototype.initialize = function() {
        return this.session = this.options.session;
      };

      MainView.prototype.render = function() {
        var bodyView, headerView;
        this.$el.empty();
        headerView = new com.uid.crowdcierge.HeaderView({
          currentTaskModel: this.session.currentTaskModel,
          constraintsModel: this.session.constraintsModel
        });
        bodyView = new com.uid.crowdcierge.BodyView({
          session: this.session
        });
        this.$el.append(headerView.$el);
        this.$el.append(bodyView.$el);
        headerView.render();
        return bodyView.render();
      };

      return MainView;

    })(Backbone.View);
  })();

}).call(this);

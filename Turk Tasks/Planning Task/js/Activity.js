(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ref;
    return com.uid.crowdcierge.Activity = (function(_super) {
      __extends(Activity, _super);

      function Activity() {
        _ref = Activity.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Activity.prototype.defaults = {
        name: null,
        description: '',
        location: null,
        duration: 0,
        categories: [],
        createTime: 0,
        start: 0
      };

      return Activity;

    })(Backbone.Model);
  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ref;
    return com.uid.crowdcierge.Constraint = (function(_super) {
      __extends(Constraint, _super);

      function Constraint() {
        _ref = Constraint.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Constraint.prototype.defaults = {
        cat: '',
        compare: '',
        unit: '',
        value: 0
      };

      return Constraint;

    })(Backbone.Model);
  })();

}).call(this);

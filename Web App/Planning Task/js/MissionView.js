(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _MISSION_HEADER, _ref;
    _MISSION_HEADER = 'Trip Details';
    return com.uid.crowdcierge.MissionView = (function(_super) {
      __extends(MissionView, _super);

      function MissionView() {
        this.renderContent = __bind(this.renderContent, this);
        this.renderHeader = __bind(this.renderHeader, this);
        this.initialize = __bind(this.initialize, this);
        _ref = MissionView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      MissionView.prototype.initialize = function() {
        return this.currentTaskModel = this.options.currentTaskModel;
      };

      MissionView.prototype.renderHeader = function() {
        return $('<div/>').text(_MISSION_HEADER);
      };

      MissionView.prototype.renderContent = function() {
        var source, template;
        source = $('#mission-view-template').html();
        template = Handlebars.compile(source);
        return $(template(this.currentTaskModel.attributes));
      };

      return MissionView;

    })(com.uid.crowdcierge.ModalView);
  })();

}).call(this);

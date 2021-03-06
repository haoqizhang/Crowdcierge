(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ADMIN_HELP_TEXT, _HELP_HEADER, _ref;
    _HELP_HEADER = 'What you can do to help';
    _ADMIN_HELP_TEXT = 'You are in admin mode and can help plan your trip from here.';
    return com.uid.crowdcierge.HelpModal = (function(_super) {
      __extends(HelpModal, _super);

      function HelpModal() {
        this.renderContent = __bind(this.renderContent, this);
        this.renderHeader = __bind(this.renderHeader, this);
        this.initialize = __bind(this.initialize, this);
        _ref = HelpModal.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      HelpModal.prototype.initialize = function() {
        return this.currentTaskModel = this.options.currentTaskModel;
      };

      HelpModal.prototype.renderHeader = function() {
        return $('<div/>').text(_HELP_HEADER);
      };

      HelpModal.prototype.renderContent = function() {
        var $el;
        $el = $('<div/>');
        if (this.currentTaskModel.get('taskType') === 'admin') {
          $el.text(_ADMIN_HELP_TEXT);
        } else {
          $el.text('TODO');
        }
        return $el;
      };

      return HelpModal;

    })(com.uid.crowdcierge.ModalView);
  })();

}).call(this);

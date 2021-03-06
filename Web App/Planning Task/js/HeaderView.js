(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ref;
    return com.uid.crowdcierge.HeaderView = (function(_super) {
      __extends(HeaderView, _super);

      function HeaderView() {
        this._handleTutorialButtonClick = __bind(this._handleTutorialButtonClick, this);
        this._handleRevealButtonClick = __bind(this._handleRevealButtonClick, this);
        this._handleHelpButtonClick = __bind(this._handleHelpButtonClick, this);
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        _ref = HeaderView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      HeaderView.prototype.className = 'header';

      HeaderView.prototype.events = {
        'click #revealButton': '_handleRevealButtonClick',
        'click #helpButton': '_handleHelpButtonClick',
        'click #tutorialButton': '_handleTutorialButtonClick'
      };

      HeaderView.prototype.initialize = function() {
        this.currentTaskModel = this.options.currentTaskModel;
        return this.constraintsModel = this.options.constraintsModel;
      };

      HeaderView.prototype.render = function() {
        var source, template;
        this.$el.empty();
        source = $('#header-view-template').html();
        template = Handlebars.compile(source);
        return this.$el.html(template(this.currentTaskModel.attributes));
      };

      HeaderView.prototype._handleHelpButtonClick = function() {
        var modal;
        modal = new com.uid.crowdcierge.HelpModal({
          currentTaskModel: this.currentTaskModel
        });
        return modal.render();
      };

      HeaderView.prototype._handleRevealButtonClick = function() {
        var modal;
        modal = new com.uid.crowdcierge.MissionView({
          currentTaskModel: this.currentTaskModel
        });
        return modal.render();
      };

      HeaderView.prototype._handleTutorialButtonClick = function() {
        return window.open('http://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/Mobi/Mobi_Turk_Tutorial.html');
      };

      return HeaderView;

    })(Backbone.View);
  })();

}).call(this);

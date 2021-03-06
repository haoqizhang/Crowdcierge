(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ref;
    return com.uid.crowdcierge.ModalView = (function(_super) {
      __extends(ModalView, _super);

      function ModalView() {
        this.closeModal = __bind(this.closeModal, this);
        this.renderContent = __bind(this.renderContent, this);
        this.renderHeader = __bind(this.renderHeader, this);
        this.render = __bind(this.render, this);
        _ref = ModalView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ModalView.prototype.className = 'modal';

      ModalView.prototype.render = function() {
        var source, template;
        $('body').remove('.overlay');
        $('body').remove('modal');
        source = $('#modal-view-template').html();
        template = Handlebars.compile(source);
        this.$el.html(template());
        this.$overlay = $('<div class="overlay"/>');
        $('body').append(this.$el);
        $('body').append(this.$overlay);
        this.$('.modal-header').append(this.renderHeader());
        this.$('.modal-content').append(this.renderContent());
        return this.$('.modal-close').click(this.closeModal);
      };

      ModalView.prototype.renderHeader = function() {
        console.warn("No-op render header called");
        return $('<div/>');
      };

      ModalView.prototype.renderContent = function() {
        console.warn("No-op render content called");
        return $('<div/>');
      };

      ModalView.prototype.closeModal = function() {
        this.$el.remove();
        return this.$overlay.remove();
      };

      return ModalView;

    })(Backbone.View);
  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ref;
    return com.uid.crowdcierge.TodoModal = (function(_super) {
      __extends(TodoModal, _super);

      function TodoModal() {
        this.renderContent = __bind(this.renderContent, this);
        this.renderHeader = __bind(this.renderHeader, this);
        this.initialize = __bind(this.initialize, this);
        _ref = TodoModal.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      TodoModal.prototype.initialize = function() {
        return this.todoModel = this.options.todoModel;
      };

      TodoModal.prototype.renderHeader = function() {
        return $('<div/>').text("Task: " + this.todoModel.get('name'));
      };

      TodoModal.prototype.renderContent = function() {
        var source, template;
        source = $('#todo-view-template').html();
        template = Handlebars.compile(source);
        return $(template(this.todoModel.attributes));
      };

      return TodoModal;

    })(com.uid.crowdcierge.ModalView);
  })();

}).call(this);

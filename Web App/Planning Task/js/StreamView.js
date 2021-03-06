(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var ActivityItemsView, CheckItemsView, TodoItemsView, _filterModels, _ref, _ref1, _ref2, _ref3,
      _this = this;
    com.uid.crowdcierge.StreamView = (function(_super) {
      __extends(StreamView, _super);

      function StreamView() {
        this._handleAddActivity = __bind(this._handleAddActivity, this);
        this._handleInputKeypress = __bind(this._handleInputKeypress, this);
        this._initializeSearchbox = __bind(this._initializeSearchbox, this);
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        _ref = StreamView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      StreamView.prototype.className = 'stream-view';

      StreamView.prototype.events = {
        'keyup input': '_handleInputKeypress',
        'click .add-button': '_handleAddActivity'
      };

      StreamView.prototype.initialize = function() {
        this.session = this.options.session;
        this.itineraryModel = this.session.itineraryModel;
        this.activitiesModel = this.session.activitiesModel;
        this.todoItemModel = this.session.todoItemModel;
        this.checkItemModel = this.session.checkItemModel;
        this.currentTaskModel = this.session.currentTaskModel;
        return this.filterModel = new Backbone.Model({
          keyword: ''
        });
      };

      StreamView.prototype.render = function() {
        var source, template;
        this.$el.empty();
        source = $('#stream-view-template').html();
        template = Handlebars.compile(source);
        this.$el.html(template(this.currentTaskModel.attributes));
        this.checkItems = new CheckItemsView({
          checkItemModel: this.checkItemModel,
          filterModel: this.filterModel
        });
        this.todoItems = new TodoItemsView({
          todoItemModel: this.todoItemModel,
          filterModel: this.filterModel
        });
        this.activityItems = new ActivityItemsView({
          activitiesModel: this.activitiesModel,
          itineraryModel: this.itineraryModel,
          filterModel: this.filterModel
        });
        this.checkItems.render();
        this.todoItems.render();
        this.activityItems.render();
        this.$('.stream-item-list').append(this.checkItems.$el);
        this.$('.stream-item-list').append(this.todoItems.$el);
        this.$('.stream-item-list').append(this.activityItems.$el);
        return this._initializeSearchbox();
      };

      StreamView.prototype._initializeSearchbox = function() {
        var cat, model, source, _i, _j, _len, _len1, _ref1, _ref2;
        source = [];
        _ref1 = this.activitiesModel.get('items').models;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          model = _ref1[_i];
          source.push({
            label: model.get('name'),
            value: model.get('name')
          });
        }
        _ref2 = this.currentTaskModel.get('categories');
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          cat = _ref2[_j];
          source.push({
            label: '#' + cat,
            value: '#' + cat
          });
        }
        return this.$('input').autocomplete({
          source: source,
          minLength: 1
        });
      };

      StreamView.prototype._handleInputKeypress = function(evt) {
        if (evt.keyCode === 13 || evt.which === 13) {
          this.filterModel.set('keyword', this.$('input').val());
          this.$('input').autocomplete('close');
        }
        if (this.$('input').val() === '') {
          this.filterModel.set('keyword', '');
          return this.$('input').autocomplete('close');
        }
      };

      StreamView.prototype._handleAddActivity = function() {
        var modal;
        modal = new com.uid.crowdcierge.CreateActivityModal({
          activitiesModel: this.activitiesModel,
          itineraryModel: this.itineraryModel,
          currentTaskModel: this.currentTaskModel
        });
        modal.render();
        return modal.prepMap();
      };

      return StreamView;

    })(Backbone.View);
    TodoItemsView = (function(_super) {
      __extends(TodoItemsView, _super);

      function TodoItemsView() {
        this._viewTodoItem = __bind(this._viewTodoItem, this);
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        _ref1 = TodoItemsView.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      TodoItemsView.prototype.tag = 'tbody';

      TodoItemsView.prototype.id = 'sysStreamBody';

      TodoItemsView.prototype.events = {
        'click .todo': '_viewTodoItem'
      };

      TodoItemsView.prototype.initialize = function() {
        this.todoItemModel = this.options.todoItemModel;
        this.filterModel = this.options.filterModel;
        this.listenTo(this.todoItemModel, 'add change remove reset', this.render);
        return this.listenTo(this.filterModel, 'change', this.render);
      };

      TodoItemsView.prototype.render = function() {
        var $item, filteredModels, model, source, template, _i, _len, _results;
        this.$el.empty();
        filteredModels = _filterModels(this.todoItemModel.models, this.filterModel.get('keyword'));
        _results = [];
        for (_i = 0, _len = filteredModels.length; _i < _len; _i++) {
          model = filteredModels[_i];
          source = $("#todo-template").html();
          template = Handlebars.compile(source);
          $item = $(template(model));
          _results.push(this.$el.append($item));
        }
        return _results;
      };

      TodoItemsView.prototype._viewTodoItem = function(evt) {
        var id, modal;
        id = evt.currentTarget.id;
        modal = new com.uid.crowdcierge.TodoModal({
          todoModel: this.todoItemModel.get(id)
        });
        return modal.render();
      };

      return TodoItemsView;

    })(Backbone.View);
    CheckItemsView = (function(_super) {
      __extends(CheckItemsView, _super);

      function CheckItemsView() {
        this.initialize = __bind(this.initialize, this);
        _ref2 = CheckItemsView.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      CheckItemsView.prototype.tag = 'tbody';

      CheckItemsView.prototype.id = 'checkStreamBody';

      CheckItemsView.prototype.initialize = function() {};

      return CheckItemsView;

    })(Backbone.View);
    ActivityItemsView = (function(_super) {
      __extends(ActivityItemsView, _super);

      function ActivityItemsView() {
        this._selectActivity = __bind(this._selectActivity, this);
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        _ref3 = ActivityItemsView.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      ActivityItemsView.prototype.tag = 'tbody';

      ActivityItemsView.prototype.id = 'userStreamBody';

      ActivityItemsView.prototype.events = {
        'click .stream-item': '_selectActivity'
      };

      ActivityItemsView.prototype.initialize = function() {
        this.activitiesModel = this.options.activitiesModel;
        this.itineraryModel = this.options.itineraryModel;
        this.filterModel = this.options.filterModel;
        this.listenTo(this.activitiesModel.get('items'), 'add change sort remove reset', this.render);
        this.listenTo(this.itineraryModel, 'add change sort remove reset', this.render);
        return this.listenTo(this.filterModel, 'change', this.render);
      };

      ActivityItemsView.prototype.render = function() {
        var $item, filteredModels, index, model, source, template, _i, _len, _results;
        this.$el.empty();
        filteredModels = _filterModels(this.activitiesModel.get('items').models, this.filterModel.get('keyword'));
        _results = [];
        for (_i = 0, _len = filteredModels.length; _i < _len; _i++) {
          model = filteredModels[_i];
          source = $("#stream-item-template").html();
          template = Handlebars.compile(source);
          index = _.indexOf(this.itineraryModel.models, model) + 1;
          $item = $(template(_.defaults({
            ind: index,
            inIt: index > 0
          }, model)));
          _results.push(this.$el.append($item));
        }
        return _results;
      };

      ActivityItemsView.prototype._selectActivity = function(evt) {
        var id;
        id = evt.currentTarget.id;
        this.activitiesModel.set('selected', null);
        return this.activitiesModel.set('selected', this.activitiesModel.get('items').get(id));
      };

      return ActivityItemsView;

    })(Backbone.View);
    return _filterModels = function(models, keyword) {
      var cat, model, result, _i, _j, _len, _len1, _ref4;
      result = [];
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        if (model.get('name').indexOf(keyword) !== -1 || model.get('description').indexOf(keyword) !== -1) {
          result.push(model);
          continue;
        }
        _ref4 = model.get('categories');
        for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
          cat = _ref4[_j];
          if (('#' + cat) === keyword) {
            result.push(model);
            continue;
          }
        }
      }
      return result;
    };
  })();

}).call(this);

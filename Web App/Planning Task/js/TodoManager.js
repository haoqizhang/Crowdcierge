(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    return com.uid.crowdcierge.TodoManager = (function() {
      function TodoManager(options) {
        this._buildActivityTodoObject = __bind(this._buildActivityTodoObject, this);
        this._addOverlapTodo = __bind(this._addOverlapTodo, this);
        this._updateTimeConstraints = __bind(this._updateTimeConstraints, this);
        this._updateCalendarConstraints = __bind(this._updateCalendarConstraints, this);
        this._updateActivityConstraints = __bind(this._updateActivityConstraints, this);
        this.updateTodo = __bind(this.updateTodo, this);
        _.extend(this, Backbone.Events, options);
        this.itineraryModel = this.session.itineraryModel;
        this.travelTimeModel = this.session.travelTimeModel;
        this.constraintsModel = this.session.constraintsModel;
        this.todoItemModel = this.session.todoItemModel;
        this.currentTaskModel = this.session.currentTaskModel;
        this.listenTo(this.itineraryModel, 'add change sort remove reset', this.updateTodo);
        this.listenTo(this.constraintsModel, 'add remove reset', this.updateTodo);
      }

      TodoManager.prototype.updateTodo = function() {
        this.todoItemModel.reset();
        this._updateActivityConstraints();
        this._updateCalendarConstraints();
        return this._updateTimeConstraints();
      };

      TodoManager.prototype._updateActivityConstraints = function() {
        var act, activityBuckets, cat, con, correct, diff, model, num, obj, timeBuckets, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _results;
        timeBuckets = {};
        activityBuckets = {};
        _ref = this.currentTaskModel.get('categories');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cat = _ref[_i];
          timeBuckets[cat] = 0;
          activityBuckets[cat] = 0;
        }
        _ref1 = this.itineraryModel.models;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          act = _ref1[_j];
          _ref2 = act.get('categories');
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            cat = _ref2[_k];
            timeBuckets[cat] += parseInt(act.get('duration'));
            activityBuckets[cat] += 1;
          }
        }
        _ref3 = this.constraintsModel.models;
        _results = [];
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          con = _ref3[_l];
          if (con.get('unit' === 'activity')) {
            num = activityBuckets[con.get('cat')];
          } else if (con.get('unit' === 'hours')) {
            num = timeBuckets[con.get('cat')] / 60;
          } else {
            num = timeBuckets[con.get('cat')];
          }
          switch (con.get('compare')) {
            case 'at least':
              correct = num >= con.get('value');
              break;
            case 'exactly':
              correct = num === con.get('value');
              break;
            case 'at most':
              correct = num <= con.get('value');
          }
          if (!correct) {
            diff = con.get('value' - num);
            obj = this._buildActivityTodoObject(con, num, diff);
            model = new Backbone.Model(obj);
            _results.push(this.todoItemModel.push(model));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      TodoManager.prototype._updateCalendarConstraints = function() {
        var block, blocks, checkBlock, endOverlap, model, startOverlap, _i, _j, _k, _len, _len1, _len2, _ref;
        blocks = [];
        _ref = this.itineraryModel.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          blocks.push({
            start: model.get('start'),
            end: model.get('start') + parseInt(model.get('duration'))
          });
        }
        for (_j = 0, _len1 = blocks.length; _j < _len1; _j++) {
          checkBlock = blocks[_j];
          for (_k = 0, _len2 = blocks.length; _k < _len2; _k++) {
            block = blocks[_k];
            if (block === checkBlock) {
              continue;
            }
            startOverlap = checkBlock.start >= block.start && checkBlock.start < block.end;
            endOverlap = checkBlock.end > block.start && checkBlock.end <= block.end;
            if (startOverlap || endOverlap) {
              this._addOverlapTodo();
              return;
            }
          }
        }
      };

      TodoManager.prototype._updateTimeConstraints = function() {};

      TodoManager.prototype._addOverlapTodo = function() {
        var model;
        model = new Backbone.Model({
          name: 'Itinerary items are overlapping',
          categories: ['todo'],
          description: 'Try to rearrange the items in the calendar so that none are overlapping.'
        });
        return this.todoItemModel.push(model);
      };

      TodoManager.prototype._buildActivityTodoObject = function(con, num, diff) {
        var err, ret;
        ret = {};
        switch (con.get('compare')) {
          case 'at most':
            err = 'Remove some \'' + con.get('cat') + '\' from the itinerary';
            break;
          case 'at least':
            err = 'Add more \'' + con.get('cat') + '\' to the itinerary';
            break;
          case 'exactly':
            if (diff < 0) {
              err = 'Remove some \'' + con.get('cat') + '\' from the itinerary';
            } else {
              err = 'Add more \'' + con.get('cat') + '\' to the itinerary';
            }
        }
        ret.name = err;
        ret.categories = ['todo', con.get('cat')];
        ret.description = ret.name;
        return ret;
      };

      return TodoManager;

    })();
  })();

}).call(this);

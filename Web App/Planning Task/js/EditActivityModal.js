(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ACTIVITY_DURATION_OPTIONS, _CREATE_ACTIVITY_HEADER, _EDIT_ACTIVITY_HEADER, _ref, _ref1, _ref2;
    _CREATE_ACTIVITY_HEADER = 'Add New Activity Idea';
    _EDIT_ACTIVITY_HEADER = 'Edit Activity: ';
    _ACTIVITY_DURATION_OPTIONS = [15, 30, 45, 60, 75, 90, 105, 120, 150, 180, 240, 300, 360, 420, 480];
    com.uid.crowdcierge.EditActivityModal = (function(_super) {
      __extends(EditActivityModal, _super);

      function EditActivityModal() {
        this._handleSaveActivity = __bind(this._handleSaveActivity, this);
        this._configureActivityPin = __bind(this._configureActivityPin, this);
        this._checkFieldsEmpty = __bind(this._checkFieldsEmpty, this);
        this.prepMap = __bind(this.prepMap, this);
        this.renderContent = __bind(this.renderContent, this);
        this.renderHeader = __bind(this.renderHeader, this);
        this.initialize = __bind(this.initialize, this);
        _ref = EditActivityModal.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      EditActivityModal.prototype.events = {
        'click .save-activity': '_handleSaveActivity'
      };

      EditActivityModal.prototype.initialize = function() {
        this.activitiesModel = this.options.activitiesModel;
        this.itineraryModel = this.options.itineraryModel;
        this.currentTaskModel = this.options.currentTaskModel;
        return this.headerText = _CREATE_ACTIVITY_HEADER;
      };

      EditActivityModal.prototype.renderHeader = function() {
        return $('<div/>').text(this.headerText);
      };

      EditActivityModal.prototype.renderContent = function() {
        var $content, cat, source, template, values, _i, _len, _ref1,
          _this = this;
        source = $('#edit-activity-template').html();
        template = Handlebars.compile(source);
        if (_ACTIVITY_DURATION_OPTIONS.indexOf(this.activity.get('duration')) < 0 && this.activity.get('duration') !== 0) {
          _ACTIVITY_DURATION_OPTIONS.push(this.activity.get('duration'));
        }
        _ACTIVITY_DURATION_OPTIONS.sort(function(a, b) {
          return a - b;
        });
        values = _.defaults({
          editable: this.currentTaskModel.get('taskType') !== 'preview',
          inItinerary: this.itineraryModel.get(this.activity.cid) != null,
          categories: this.currentTaskModel.get('categories'),
          timeOptions: _ACTIVITY_DURATION_OPTIONS
        }, this.activity.attributes);
        $content = $(template(values));
        if (this.activity.get('duration') > 0) {
          $content.find('select').val(this.activity.get('duration')).attr('selected', true);
        }
        _ref1 = this.activity.get('categories');
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          cat = _ref1[_i];
          $content.find("input[value='" + cat + "']").attr('checked', true);
        }
        this.$el.addClass('modal-fat');
        return $content;
      };

      EditActivityModal.prototype.prepMap = function() {
        var startLoc;
        this.map = L.map(this.$('#editActivityMap')[0]);
        L.tileLayer('http://{s}.tile.cloudmade.com/ebeae5620c954242916bfba0601e86d8/99953/256/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
        }).addTo(this.map);
        startLoc = this.currentTaskModel.get('start');
        this.map.setView([startLoc.lat, startLoc.long], 13, true);
        return this._configureActivityPin();
      };

      EditActivityModal.prototype._checkFieldsEmpty = function() {
        var err;
        if (this.$('#editActivityName').val().trim() === '') {
          err = true;
          alert('Please enter a name for the activity');
        }
        if (this.$('#editActivityLocation').val().trim() === '') {
          err = true;
          alert('Please enter a location for the activity');
        }
        return err;
      };

      EditActivityModal.prototype._configureActivityPin = function() {};

      EditActivityModal.prototype._handleSaveActivity = function() {};

      return EditActivityModal;

    })(com.uid.crowdcierge.ModalView);
    com.uid.crowdcierge.CreateActivityModal = (function(_super) {
      __extends(CreateActivityModal, _super);

      function CreateActivityModal() {
        this._handleSaveActivity = __bind(this._handleSaveActivity, this);
        this._configureActivityPin = __bind(this._configureActivityPin, this);
        this.initialize = __bind(this.initialize, this);
        _ref1 = CreateActivityModal.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      CreateActivityModal.prototype.initialize = function() {
        CreateActivityModal.__super__.initialize.call(this);
        this.activity = new com.uid.crowdcierge.Activity();
        return this.headerText = _CREATE_ACTIVITY_HEADER;
      };

      CreateActivityModal.prototype._configureActivityPin = function() {
        var startLoc;
        startLoc = this.currentTaskModel.get('start');
        this.marker = L.marker([startLoc.lat, startLoc.long], {
          zIndexOffset: 10000,
          draggable: true
        });
        this.marker.bindPopup('New Activity');
        this.marker.addTo(this.map);
        return this.marker.openPopup();
      };

      CreateActivityModal.prototype._handleSaveActivity = function() {
        var data, input;
        if (this._checkFieldsEmpty()) {
          return;
        }
        data = {
          name: this.$('#editActivityName').val().trim(),
          description: this.$('#editActivityDescription').val().trim(),
          location: {
            name: this.$('#editActivityLocation').val().trim(),
            lat: this.marker.getLatLng().lat,
            long: this.marker.getLatLng().lng
          },
          duration: this.$('#editActivityDuration').find(":selected").val(),
          categories: (function() {
            var _i, _len, _ref2, _results;
            _ref2 = this.$('input:checked');
            _results = [];
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              input = _ref2[_i];
              _results.push($(input).val());
            }
            return _results;
          }).call(this)
        };
        this.activity.set(data);
        this.activitiesModel.get('items').add(this.activity);
        return this.closeModal();
      };

      return CreateActivityModal;

    })(com.uid.crowdcierge.EditActivityModal);
    return com.uid.crowdcierge.EditExistingActivityModal = (function(_super) {
      __extends(EditExistingActivityModal, _super);

      function EditExistingActivityModal() {
        this._configureActivityPin = __bind(this._configureActivityPin, this);
        this.initialize = __bind(this.initialize, this);
        _ref2 = EditExistingActivityModal.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      EditExistingActivityModal.prototype.initialize = function() {
        EditExistingActivityModal.__super__.initialize.call(this);
        this.activity = this.options.activity;
        return this.headerText = _EDIT_ACTIVITY_HEADER + this.activity.get('name');
      };

      EditExistingActivityModal.prototype._configureActivityPin = function() {
        var latlng;
        latlng = [this.activity.get('location').lat, this.activity.get('location').long];
        this.map.setView(latlng, 13, true);
        this.marker = L.marker(latlng, {
          zIndexOffset: 10000,
          draggable: true
        });
        this.marker.bindPopup(this.activity.get('name'));
        this.marker.addTo(this.map);
        return this.marker.openPopup();
      };

      return EditExistingActivityModal;

    })(com.uid.crowdcierge.EditActivityModal);
  })();

}).call(this);

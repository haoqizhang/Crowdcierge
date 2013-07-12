(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _CREATE_ACTIVITY_HEADER, _EDIT_ACTIVITY_HEADER, _ref, _ref1;
    _CREATE_ACTIVITY_HEADER = 'Add New Activity Idea';
    _EDIT_ACTIVITY_HEADER = 'Edit Activity: ';
    com.uid.crowdcierge.EditActivityModal = (function(_super) {
      __extends(EditActivityModal, _super);

      function EditActivityModal() {
        this._configureActivityPin = __bind(this._configureActivityPin, this);
        this.prepMap = __bind(this.prepMap, this);
        this.renderContent = __bind(this.renderContent, this);
        this.renderHeader = __bind(this.renderHeader, this);
        this.initialize = __bind(this.initialize, this);
        _ref = EditActivityModal.__super__.constructor.apply(this, arguments);
        return _ref;
      }

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
        var $content, source, template, values;
        source = $('#edit-activity-template').html();
        template = Handlebars.compile(source);
        values = _.defaults({
          editable: this.currentTaskModel.get('taskType') !== 'preview',
          inItinerary: this.itineraryModel.get(this.activity.cid) != null,
          categories: this.currentTaskModel.get('categories')
        }, this.activity.attributes);
        $content = $(template(values));
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
        return this._configureActivityPin;
      };

      EditActivityModal.prototype._configureActivityPin = function() {};

      return EditActivityModal;

    })(com.uid.crowdcierge.ModalView);
    return com.uid.crowdcierge.CreateActivityModal = (function(_super) {
      __extends(CreateActivityModal, _super);

      function CreateActivityModal() {
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
        var marker, startLoc;
        startLoc = this.currentTaskModel.get('start');
        marker = L.marker([startLoc.lat, startLoc.long]);
        return marker.addTo(this.map);
      };

      return CreateActivityModal;

    })(com.uid.crowdcierge.EditActivityModal);
  })();

}).call(this);

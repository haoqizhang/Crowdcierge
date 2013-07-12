(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ACTIVITY_HEADER, _ref;
    _ACTIVITY_HEADER = 'Activity: ';
    return com.uid.crowdcierge.EditActivityModal = (function(_super) {
      __extends(EditActivityModal, _super);

      function EditActivityModal() {
        this.prepMap = __bind(this.prepMap, this);
        this.renderContent = __bind(this.renderContent, this);
        this.renderHeader = __bind(this.renderHeader, this);
        this.initialize = __bind(this.initialize, this);
        _ref = EditActivityModal.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      EditActivityModal.prototype.events = {
        'click .add-to-itinerary': '_addToItinerary',
        'click .remove-from-itinerary': '_removeFromItinerary'
      };

      EditActivityModal.prototype.initialize = function() {
        this.activity = this.options.activity;
        this.activitiesModel = this.options.activitiesModel;
        this.itineraryModel = this.options.itineraryModel;
        return this.currentTaskModel = this.options.currentTaskModel;
      };

      EditActivityModal.prototype.renderHeader = function() {
        return $('<div/>').text(_ACTIVITY_HEADER + this.activity.get('name'));
      };

      EditActivityModal.prototype.renderContent = function() {
        var $content, source, template, values;
        source = $('#view-activity-template').html();
        template = Handlebars.compile(source);
        values = _.defaults({
          editable: this.currentTaskModel.get('taskType') !== 'preview'
        }, {
          inItinerary: this.itineraryModel.get(this.activity.cid) != null
        }, this.activity.attributes);
        $content = $(template(values));
        this.$el.addClass('modal-fat');
        return $content;
      };

      EditActivityModal.prototype.prepMap = function() {
        this.map = L.map(this.$('#viewActivityMap')[0]);
        return L.tileLayer('http://{s}.tile.cloudmade.com/ebeae5620c954242916bfba0601e86d8/99953/256/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
        }).addTo(this.map);
      };

      return EditActivityModal;

    })(com.uid.crowdcierge.ModalView);
  })();

}).call(this);

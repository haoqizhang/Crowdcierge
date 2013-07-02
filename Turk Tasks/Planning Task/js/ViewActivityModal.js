// Generated by CoffeeScript 1.6.2
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _ACTIVITY_HEADER, _ref;

    _ACTIVITY_HEADER = 'Activity: ';
    return com.uid.crowdcierge.ViewActivityModal = (function(_super) {
      __extends(ViewActivityModal, _super);

      function ViewActivityModal() {
        this.prepMap = __bind(this.prepMap, this);
        this.renderContent = __bind(this.renderContent, this);
        this.renderHeader = __bind(this.renderHeader, this);
        this.initialize = __bind(this.initialize, this);        _ref = ViewActivityModal.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ViewActivityModal.prototype.initialize = function() {
        this.activity = this.options.activity;
        this.activitiesModel = this.options.activitiesModel;
        this.itineraryModel = this.options.itineraryModel;
        return this.currentTaskModel = this.options.currentTaskModel;
      };

      ViewActivityModal.prototype.renderHeader = function() {
        return $('<div/>').text(_ACTIVITY_HEADER + this.activity.get('name'));
      };

      ViewActivityModal.prototype.renderContent = function() {
        var $content, source, template;

        source = $('#view-activity-template').html();
        template = Handlebars.compile(source);
        $content = $(template(this.activity.attributes));
        this.$el.addClass('modal-fat');
        return $content;
      };

      ViewActivityModal.prototype.prepMap = function() {
        var marker;

        this.map = L.map(this.$('#viewActivityMap')[0]);
        L.tileLayer('http://{s}.tile.cloudmade.com/ebeae5620c954242916bfba0601e86d8/99953/256/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
        }).addTo(this.map);
        this.map.setView([this.activity.get('location').lat, this.activity.get('location').long], 13);
        marker = L.marker([this.activity.get('location').lat, this.activity.get('location').long], {
          zIndexOffset: 10000
        });
        marker.bindPopup(this.activity.get('name'));
        marker.addTo(this.map);
        return marker.openPopup();
      };

      return ViewActivityModal;

    })(com.uid.crowdcierge.ModalView);
  })();

}).call(this);
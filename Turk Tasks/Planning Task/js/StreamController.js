(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var _ADD_URL, _EDIT_URL;
    _EDIT_URL = 'https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourEdit.php';
    _ADD_URL = 'https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourEntry.php';
    return com.uid.crowdcierge.StreamController = (function() {
      function StreamController(options) {
        this._submitAdd = __bind(this._submitAdd, this);
        this._submitEdit = __bind(this._submitEdit, this);
        _.extend(this, options, Backbone.Events);
        this.activitiesModel = this.session.activitiesModel;
        this.currentTaskModel = this.session.currentTaskModel;
        this.listenTo(this.activitiesModel.get('items'), 'change', this._submitEdit);
        this.listenTo(this.activitiesModel.get('items'), 'add', this._submitAdd);
      }

      StreamController.prototype._submitEdit = function(activity) {
        var submission, _ref,
          _this = this;
        submission = {};
        submission.data = activity.attributes;
        submission.type = 'activity';
        return $.ajax({
          type: 'POST',
          url: _EDIT_URL,
          data: {
            userId: 'lol',
            taskId: this.currentTaskModel.get('tid'),
            assignmentId: (_ref = this.currentTaskModel.get('assignmentId')) != null ? _ref : '',
            answer: JSON.stringify(activity.attributes),
            oldid: activity.id,
            type: 'turktour'
          },
          success: function(data) {
            data = data.replace(/(\r\n|\n|\r)/gm, '');
            activity.id = parseInt(data);
            _this.stateController.saveState();
            return _this.activitiesModel.get('items').sort();
          }
        });
      };

      StreamController.prototype._submitAdd = function(activity) {
        var _ref,
          _this = this;
        return $.ajax({
          type: 'POST',
          url: _ADD_URL,
          data: {
            userId: 'lol',
            taskId: this.currentTaskModel.get('tid'),
            assignmentId: (_ref = this.currentTaskModel.get('assignmentId')) != null ? _ref : '',
            answer: JSON.stringify(activity.attributes),
            type: 'turktour'
          },
          success: function(data) {
            data = data.replace(/(\r\n|\n|\r)/gm, '');
            activity.id = parseInt(data);
            return _this.activitiesModel.get('items').sort();
          }
        });
      };

      return StreamController;

    })();
  })();

}).call(this);

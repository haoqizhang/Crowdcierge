(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var _SAVE_ITINERARY_URL;
    _SAVE_ITINERARY_URL = 'https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourItinerary.php';
    return com.uid.crowdcierge.StateController = (function() {
      function StateController(options) {
        this.saveState = __bind(this.saveState, this);
        _.extend(this, options, Backbone.Events);
        this.itineraryModel = this.session.itineraryModel;
        this.currentTaskModel = this.session.currentTaskModel;
        this.listenTo(this.itineraryModel, 'add remove', this.saveState);
      }

      StateController.prototype.saveState = function() {
        var itinerary, shit, state, _i, _len, _ref, _ref1;
        itinerary = [];
        _ref = this.itineraryModel.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          shit = _ref[_i];
          itinerary.push('user_' + shit.id);
        }
        this.currentTaskModel.get('state').itinerary = itinerary;
        state = this.currentTaskModel.get('state');
        return $.ajax({
          type: 'POST',
          url: _SAVE_ITINERARY_URL,
          data: {
            userId: 'lol',
            taskId: this.currentTaskModel.get('tid'),
            assignmentId: (_ref1 = this.currentTaskModel.get('assignmentId')) != null ? _ref1 : '',
            answer: JSON.stringify(state),
            startState: this.currentTaskModel.get('stateId'),
            type: 'turktour'
          }
        });
      };

      return StateController;

    })();
  })();

}).call(this);

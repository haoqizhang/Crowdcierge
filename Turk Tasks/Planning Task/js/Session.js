(function() {
  (function() {
    return com.uid.crowdcierge.Session = (function() {
      function Session() {
        var activities,
          _this = this;
        this.itineraryModel = new Backbone.Collection;
        this.itineraryModel.model = com.uid.crowdcierge.Activity;
        this.itineraryModel.comparator = (function(act) {
          return act.get('start');
        });
        this.travelTimeModel = new Backbone.Collection;
        activities = new Backbone.Collection;
        activities.model = com.uid.crowdcierge.Activity;
        this.activitiesModel = new Backbone.Model({
          items: activities,
          selected: null
        });
        this.activitiesModel.get('items').comparator = (function(act) {
          return -act.id;
        });
        this.constraintsModel = new Backbone.Collection;
        this.constraintsModel.model = com.uid.crowdcierge.Constraint;
        this.todoItemModel = new Backbone.Collection;
        this.checkItemModel = new Backbone.Collection;
        this.currentTaskModel = new Backbone.Model;
      }

      return Session;

    })();
  })();

}).call(this);

// Generated by CoffeeScript 1.6.2
(function() {
  (function() {
    return com.uid.crowdcierge.Session = (function() {
      function Session() {
        var activities;

        this.itineraryModel = new Backbone.Collection;
        this.itineraryModel.model = com.uid.crowdcierge.Activity;
        activities = new Backbone.Collection;
        activities.model = com.uid.crowdcierge.Activity;
        this.activitiesModel = new Backbone.Model({
          items: activities,
          selected: null
        });
        this.constraintsModel = new Backbone.Collection;
        this.constraintsModel.model = com.uid.crowdcierge.Constraint;
        this.checkItemModel = new Backbone.Collection;
        this.currentTaskModel = new Backbone.Model;
      }

      return Session;

    })();
  })();

}).call(this);

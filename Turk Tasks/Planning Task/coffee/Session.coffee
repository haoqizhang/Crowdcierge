do ->
  class com.uid.crowdcierge.Session

    # The number of models in this class IS TOO DAMN HIGH
    constructor: ->
      @itineraryModel = new Backbone.Collection
      @itineraryModel.model = com.uid.crowdcierge.Activity

      @travelTimeModel = new Backbone.Collection

      activities = new Backbone.Collection
      activities.model = com.uid.crowdcierge.Activity
      @activitiesModel = new Backbone.Model
        items: activities
        selected: null

      @constraintsModel = new Backbone.Collection
      @constraintsModel.model = com.uid.crowdcierge.Constraint

      @todoItemModel = new Backbone.Collection
      @checkItemModel = new Backbone.Collection

      @currentTaskModel = new Backbone.Model
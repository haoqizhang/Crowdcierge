do ->
  class com.uid.crowdcierge.Session
    constructor: ->
      @itineraryModel = new Backbone.Collection
      @itineraryModel.model = com.uid.crowdcierge.Activity

      activities = new Backbone.Collection
      activities.model = com.uid.crowdcierge.Activity
      @activitiesModel = new Backbone.Model
        items: activities
        selected: null

      @constraintsModel = new Backbone.Collection
      @constraintsModel.model = com.uid.crowdcierge.Constraint

      @checkItemModel = new Backbone.Collection

      @currentTaskModel = new Backbone.Model
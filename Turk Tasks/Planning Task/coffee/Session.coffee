do ->
  class com.uid.crowdcierge.Session
    constructor: ->
      @itineraryModel = new Backbone.Collection
        model: com.uid.crowdcierge.ItineraryItem

      @activitiesModel = new Backbone.Collection
        model: com.uid.crowdcierge.Activity

      @constraintsModel = new Backbone.Collection
        model: com.uid.crowdcierge.Constraint

      @checkItemModel = new Backbone.Collection

      @currentTaskModel = new Backbone.Model
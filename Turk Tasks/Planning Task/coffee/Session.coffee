do ->
  class Session
    initialize: =>
      @itineraryModel = new Backbone.Collection

      @activitiesModel = new Backbone.Collection
        model: ActivityModel

      @constraintsModel = new Backbone.Collection

      @systemModel = new Backbone.Collection

      @checkItemModel = new Backbone.Collection
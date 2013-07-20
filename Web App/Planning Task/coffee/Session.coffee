do ->
  class com.uid.crowdcierge.Session

    # The number of models in this class IS TOO DAMN HIGH
    constructor: ->
      @itineraryModel = new Backbone.Collection
      @itineraryModel.model = com.uid.crowdcierge.Activity
      @itineraryModel.comparator = ((act) => act.get('start'))

      @travelTimeModel = new Backbone.Collection

      activities = new Backbone.Collection
      activities.model = com.uid.crowdcierge.Activity
      @activitiesModel = new Backbone.Model
        items: activities
        selected: null
      @activitiesModel.get('items').comparator = ((act) => return -act.id)

      @constraintsModel = new Backbone.Collection
      @constraintsModel.model = com.uid.crowdcierge.Constraint

      @todoItemModel = new Backbone.Collection
      @checkItemModel = new Backbone.Collection

      @currentTaskModel = new Backbone.Model
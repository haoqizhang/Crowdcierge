do ->
  class com.uid.crowdcierge.Session

    # The number of models in this class IS TOO DAMN HIGH
    constructor: ->
      @itineraryModel = new Backbone.Collection
      @itineraryModel.model = com.uid.crowdcierge.Activity
      @itineraryModel.comparator = ((act1, act2) => 
        if act1.get('start') < act2.get('start')
          return -1
        else if act1.get('start') > act2.get('start')
          return 1
        else
          return 0
        )

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
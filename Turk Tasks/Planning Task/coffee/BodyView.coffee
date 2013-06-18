do ->
  class com.uid.crowdcierge.BodyView extends Backbone.View
    className: 'planning-body'

    initialize: =>
      @session = @options.session

    render: =>
      @$el.empty()
      
      streamView = new com.uid.crowdcierge.StreamView
        session: @session
      mapView = new com.uid.crowdcierge.MapView
        session: @session
      itineraryView = new com.uid.crowdcierge.ItineraryView
        session: @session

      streamView.render()
      mapView.render()
      itineraryView.render()

      @$el.append streamView.$el
      @$el.append mapView.$el
      @$el.append itineraryView.$el  
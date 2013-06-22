do ->
  class com.uid.crowdcierge.ItineraryView extends Backbone.View
    className: 'itinerary-view'

    initialize: =>
      @session = @options.session
      @currentTaskModel = @session.currentTaskModel
      @itineraryModel = @session.itineraryModel
      @travelTimeModel = @session.travelTimeModel

    render: =>
      @$el.empty()

      source = $('#itinerary-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template()
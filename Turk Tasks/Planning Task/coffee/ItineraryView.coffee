do ->
  class com.uid.crowdcierge.ItineraryView extends Backbone.View
    initialize: =>
      @session = @options.session
    render: =>
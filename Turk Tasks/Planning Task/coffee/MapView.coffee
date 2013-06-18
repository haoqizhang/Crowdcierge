do ->
  class com.uid.crowdcierge.MapView extends Backbone.View
    initialize: =>
      @session = @options.session
    render: =>
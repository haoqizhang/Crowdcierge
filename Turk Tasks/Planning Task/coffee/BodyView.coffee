do ->
  class com.uid.crowdcierge.BodyView extends Backbone.View
    initialize: =>
      @session = @options.session
    render: =>
      
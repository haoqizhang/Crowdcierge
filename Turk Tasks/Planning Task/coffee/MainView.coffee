do ->
  class com.uid.crowdcierge.MainView extends Backbone.View
    initialize: =>
      @session = @options.session

    render: =>
      @$el = $('body').empty()
      
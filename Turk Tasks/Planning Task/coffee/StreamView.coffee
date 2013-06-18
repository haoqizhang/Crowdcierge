do ->
  class com.uid.crowdcierge.StreamView extends Backbone.View
    className: 'stream-view'

    initialize: =>
      @session = @options.session
      @itineraryModel = @session.itineraryModel
      @activitiesModel = @session.activitiesModel
      @constraintsModel = @session.constraintsModel
      @checkItemModel = @session.checkItemModel
      @currentTaskModel = @session.currentTaskModel

    render: =>
      @$el.empty()

      source = $('#stream-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template(@currentTaskModel.attributes)
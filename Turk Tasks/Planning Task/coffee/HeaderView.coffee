do ->
  class com.uid.crowdcierge.HeaderView extends Backbone.View
    className: 'header'

    events:
      'click #revealButton': '_handleRevealButtonClick'
      'click #helpButton': '_handleHelpButtonClick'

    initialize: =>
      @currentTaskModel = @options.currentTaskModel
      @constraintsModel = @options.constraintsModel

    render: =>
      @$el.empty()

      source = $('#header-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template(@currentTaskModel.attributes)

    _handleHelpButtonClick: =>
      console.log 'clicked help button'

    _handleRevealButtonClick: =>
      console.log 'clicked mission button'
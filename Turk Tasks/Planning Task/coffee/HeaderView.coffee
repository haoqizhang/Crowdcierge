do ->
  class com.uid.crowdcierge.HeaderView extends Backbone.View
    className: 'header'

    events:
      'click #revealButton': '_handleRevealButtonClick'
      'click #helpButton': '_handleHelpButtonClick'
      'click #tutorialButton': '_handleTutorialButtonClick'

    initialize: =>
      @currentTaskModel = @options.currentTaskModel
      @constraintsModel = @options.constraintsModel

    render: =>
      @$el.empty()

      source = $('#header-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template(@currentTaskModel.attributes)

    _handleHelpButtonClick: =>
      modal = new com.uid.crowdcierge.HelpModal
        currentTaskModel: @currentTaskModel
      modal.render()

    _handleRevealButtonClick: =>
      modal = new com.uid.crowdcierge.MissionView
        currentTaskModel: @currentTaskModel
      modal.render()

    _handleTutorialButtonClick: =>
      window.open 'http://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/Mobi/Mobi_Turk_Tutorial.html'
do ->
  _MISSION_HEADER = 'Trip Details'

  class com.uid.crowdcierge.MissionView extends com.uid.crowdcierge.ModalView
    initialize: =>
      @currentTaskModel = @options.currentTaskModel

    renderHeader: =>
      return $('<div/>').text(_MISSION_HEADER)

    renderContent: =>
      source = $('#mission-view-template').html()
      template = Handlebars.compile(source)
      return $(template(@currentTaskModel.attributes))
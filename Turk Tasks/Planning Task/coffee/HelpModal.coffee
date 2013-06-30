do ->
  _HELP_HEADER = 'What you can do to help'

  class com.uid.crowdcierge.HelpModal extends com.uid.crowdcierge.ModalView
    intiialize: =>
      @currentTaskModel = @options.currentTaskModel
      @className = @className + ' modal-thin'

    renderHeader: =>
      return $('<div/>').text(_HELP_HEADER)

    renderContent: =>
      return $('<div/>').text(_HELP_TEXT)
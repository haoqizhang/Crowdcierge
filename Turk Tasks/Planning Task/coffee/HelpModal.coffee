do ->
  class com.uid.crowdcierge.HelpModal extends com.uid.crowdcierge.ModalView
    intiialize: =>
      @currentTaskModel = @options.currentTaskModel
      @className = @className + ' modal-thin'

    renderHeader: =>
      return $('<div/>').text('What you can do to help')

    renderContent: =>
      return $('<div/>').text('What you can do to help')
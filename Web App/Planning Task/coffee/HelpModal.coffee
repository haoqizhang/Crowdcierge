do ->
  _HELP_HEADER = 'What you can do to help'
  _ADMIN_HELP_TEXT = 'You are in admin mode and can help plan your trip from here.'

  class com.uid.crowdcierge.HelpModal extends com.uid.crowdcierge.ModalView
    initialize: =>
      @currentTaskModel = @options.currentTaskModel

    renderHeader: =>
      return $('<div/>').text(_HELP_HEADER)

    renderContent: =>
      $el = $('<div/>')
      if @currentTaskModel.get('taskType') == 'admin'
        $el.text(_ADMIN_HELP_TEXT)
      else
        $el.text('TODO')
      return $el
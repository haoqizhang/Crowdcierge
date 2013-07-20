do ->
  class com.uid.crowdcierge.TodoModal extends com.uid.crowdcierge.ModalView
    initialize: =>
      @todoModel = @options.todoModel

    renderHeader: =>
      return $('<div/>').text("Task: " + @todoModel.get('name'))

    renderContent: =>
      source = $('#todo-view-template').html()
      template = Handlebars.compile(source)
      return $(template(@todoModel.attributes))
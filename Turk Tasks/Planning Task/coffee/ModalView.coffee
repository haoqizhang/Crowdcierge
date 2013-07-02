do ->
  class com.uid.crowdcierge.ModalView extends Backbone.View
    className: 'modal'

    events:
      'click .modal-close': 'closeModal'
      
    render: =>
      source = $('#modal-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template()
      @$overlay = $('<div class="overlay"/>')

      # Get modal in the DOM before adding the content
      $('body').append @$el
      $('body').append @$overlay

      @$('.modal-header').append @renderHeader()
      @$('.modal-content').append @renderContent()

    renderHeader: =>
      console.warn "No-op render header called"
      return $('<div/>')

    renderContent: =>
      console.warn "No-op render content called"
      return $('<div/>')

    closeModal: =>
      @$el.remove()
      @$overlay.remove()
do ->
  class com.uid.crowdcierge.FooterView extends Backbone.View
    className: 'footer'

    render: =>
      switch @model.get 'taskType'
        when 'admin' then @_renderAdmin()
        when 'preview' then @_renderPreview()
        when 'task' then @_renderTask()

    _renderAdmin: =>

    _renderPreview: =>

    _renderTask: =>

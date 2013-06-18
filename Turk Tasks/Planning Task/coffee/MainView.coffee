do ->
  class com.uid.crowdcierge.MainView extends Backbone.View
    className: 'crowdcierge-main'

    initialize: =>
      @session = @options.session

    render: =>
      @$el.empty()
      
      headerView = new com.uid.crowdcierge.HeaderView
        currentTaskModel: @session.currentTaskModel
        constraintsModel: @session.constraintsModel
      bodyView = new com.uid.crowdcierge.BodyView
        session: @session

      headerView.render()
      bodyView.render()

      @$el.append headerView.$el
      @$el.append bodyView.$el
      
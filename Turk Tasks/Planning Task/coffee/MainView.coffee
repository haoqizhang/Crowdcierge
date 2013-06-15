do ->
  class com.uid.crowdcierge.MainView extends Backbone.View
    initialize: =>
      @session = @options.session

    render: =>
      @$el = $('body').empty()
      
      headerView = new com.uid.crowdcierge.HeaderView
        currentTaskModel: @session.currentTaskModel
        constraintsModel: @session.constraintsModel
      bodyView = new com.uid.crowdcierge.BodyView
        session: @session
      footerView = new com.uid.crowdcierge.FooterView
        model: @session.currentTaskModel

      headerView.render()
      bodyView.render()
      footerView.render()

      @$el.append headerView.$el
      @$el.append bodyView.$el
      @$el.append footerView.$el
      
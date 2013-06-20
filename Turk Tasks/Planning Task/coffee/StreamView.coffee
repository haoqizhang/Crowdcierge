do ->
  class com.uid.crowdcierge.StreamView extends Backbone.View
    className: 'stream-view'

    initialize: =>
      @session = @options.session
      @itineraryModel = @session.itineraryModel
      @activitiesModel = @session.activitiesModel
      @todoItemModel = @session.todoItemModel
      @checkItemModel = @session.checkItemModel
      @currentTaskModel = @session.currentTaskModel

    render: =>
      @$el.empty()

      source = $('#stream-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template(@currentTaskModel.attributes)

      @checkItems = new CheckItemsView
        checkItemModel: @checkItemModel

      @todoItems = new TodoItemsView
        todoItemModel: @todoItemModel

      @activityItems = new ActivityItemsView
        activitiesModel: @activitiesModel
        itineraryModel: @itineraryModel

      @checkItems.render()
      @todoItems.render()
      @activityItems.render()

      @$('.stream-item-list').append @checkItems.$el
      @$('.stream-item-list').append @todoItems.$el
      @$('.stream-item-list').append @activityItems.$el

  class TodoItemsView extends Backbone.View
    tag: 'tbody'
    id: 'sysStreamBody'

    events:
      'click .todo': '_viewTodoItem'

    initialize: =>
      @todoItemModel = @options.todoItemModel

      @listenTo @todoItemModel, 'add change remove reset', @render
      
    render: =>
      @$el.empty()

      for model in @todoItemModel.models
        source = $("#todo-template").html();
        template = Handlebars.compile(source);
        $item = $(template(model));
        @$el.append $item

    _viewTodoItem: (evt) =>
      id = evt.currentTarget.id
      console.log @todoItemModel.get(id)

  class CheckItemsView extends Backbone.View
    tag: 'tbody'
    id: 'checkStreamBody'

    initialize: =>

  class ActivityItemsView extends Backbone.View
    tag: 'tbody'
    id: 'userStreamBody'

    events:
      'click .stream-item': '_selectActivity'

    initialize: =>
      @activitiesModel = @options.activitiesModel
      @itineraryModel = @options.itineraryModel

      @listenTo @activitiesModel, 'add change remove reset', @render

    render: =>
      @$el.empty()

      for model in @activitiesModel.get('items').models
        source = $("#stream-item-template").html();
        template = Handlebars.compile(source);

        index = _.indexOf(@itineraryModel.models, model) + 1

        $item = $(template(_.defaults {ind: index, inIt: index > 0}, 
          model));
        @$el.append $item

    _selectActivity: (evt) =>
      id = evt.currentTarget.id
      @activitiesModel.set 'selected', @activitiesModel.get('items').get(id)
do ->
  class com.uid.crowdcierge.StreamView extends Backbone.View
    className: 'stream-view'

    events:
      'keyup input': '_handleInputKeypress'

    initialize: =>
      @session = @options.session
      @itineraryModel = @session.itineraryModel
      @activitiesModel = @session.activitiesModel
      @todoItemModel = @session.todoItemModel
      @checkItemModel = @session.checkItemModel
      @currentTaskModel = @session.currentTaskModel

      @filterModel = new Backbone.Model
        keyword: ''

    render: =>
      @$el.empty()

      source = $('#stream-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template(@currentTaskModel.attributes)

      @checkItems = new CheckItemsView
        checkItemModel: @checkItemModel
        filterModel: @filterModel

      @todoItems = new TodoItemsView
        todoItemModel: @todoItemModel
        filterModel: @filterModel

      @activityItems = new ActivityItemsView
        activitiesModel: @activitiesModel
        itineraryModel: @itineraryModel
        filterModel: @filterModel

      @checkItems.render()
      @todoItems.render()
      @activityItems.render()

      @$('.stream-item-list').append @checkItems.$el
      @$('.stream-item-list').append @todoItems.$el
      @$('.stream-item-list').append @activityItems.$el

      @_initializeSearchbox()

    _initializeSearchbox: =>
      source = []
      for model in @activitiesModel.get('items').models
        source.push
          label: model.get('name')
          value: model.get('name')

      for cat in @currentTaskModel.get('categories')
        source.push
          label: '#' + cat
          value: '#' + cat

      @$('input').autocomplete
        source: source
        minLength: 1

    _handleInputKeypress: (evt) =>
      if evt.keyCode == 13 or evt.which == 13
        @filterModel.set 'keyword', @$('input').val()
        @$('input').autocomplete('close')

      if @$('input').val() == ''
        @filterModel.set 'keyword', ''
        @$('input').autocomplete('close')

  class TodoItemsView extends Backbone.View
    tag: 'tbody'
    id: 'sysStreamBody'

    events:
      'click .todo': '_viewTodoItem'

    initialize: =>
      @todoItemModel = @options.todoItemModel
      @filterModel = @options.filterModel

      @listenTo @todoItemModel, 'add change remove reset', @render
      @listenTo @filterModel, 'change', @render
      
    render: =>
      @$el.empty()

      filteredModels = _filterModels(@todoItemModel.models,
        @filterModel.get('keyword'))
      for model in filteredModels
        source = $("#todo-template").html();
        template = Handlebars.compile(source);
        $item = $(template(model));
        @$el.append $item

    _viewTodoItem: (evt) =>
      id = evt.currentTarget.id
      modal = new com.uid.crowdcierge.TodoModal
        todoModel: @todoItemModel.get(id)
      modal.render()

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
      @filterModel = @options.filterModel

      @listenTo @activitiesModel, 'add change remove reset', @render
      @listenTo @itineraryModel, 'add change remove reset', @render
      @listenTo @filterModel, 'change', @render

    render: =>
      @$el.empty()

      filteredModels = _filterModels(@activitiesModel.get('items').models,
        @filterModel.get('keyword'))
      for model in filteredModels
        source = $("#stream-item-template").html();
        template = Handlebars.compile(source);
        index = _.indexOf(@itineraryModel.models, model) + 1
        $item = $(template(_.defaults {ind: index, inIt: index > 0}, 
          model));
        @$el.append $item

    _selectActivity: (evt) =>
      id = evt.currentTarget.id
      @activitiesModel.set 'selected', null
      @activitiesModel.set 'selected', @activitiesModel.get('items').get(id)

  _filterModels = (models, keyword) =>
    result = []
    for model in models
      if model.get('name').indexOf(keyword) != -1 or model.get('description').indexOf(keyword) != -1
        result.push(model)
        continue

      for cat in model.get 'categories'
        if ('#' + cat) == keyword
          result.push(model)
          continue

    return result
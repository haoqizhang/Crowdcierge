do ->
  class com.uid.crowdcierge.TodoManager
    constructor: (options) ->
      _.extend @,
        Backbone.Events,
        options

      @itineraryModel = @session.itineraryModel
      @constraintsModel = @session.constraintsModel
      @todoItemModel = @session.todoItemModel
      @currentTaskModel = @session.currentTaskModel

      @listenTo @itineraryModel, 'add remove reset', @updateTodo
      @listenTo @constraintsModel, 'add remove reset', @updateTodo

    updateTodo: =>
      @_updateActivityConstraints()
      @_updateCalendarConstraints()
      @_updateTimeConstraints()

    _updateActivityConstraints: =>
      timeBuckets = {}
      activityBuckets = {}

      for cat in @currentTaskModel.get 'categories'
        timeBuckets[cat] = 0
        activityBuckets[cat] = 0
      
      for act in @itineraryModel.models
        for cat in act.get 'categories'
          timeBuckets[cat] += parseInt(act.get 'duration')
          activityBuckets[cat] += 1

      for con in @constraintsModel.models
        if con.get 'unit' == 'activity'
          num = activityBuckets[con.get 'cat']
        else if con.get 'unit' == 'hours'
          num = timeBuckets[con.get 'cat'] / 60
        else
          num = timeBuckets[con.get 'cat']

        switch con.get 'compare'
          when 'at least'
            correct = num >= con.get 'value'
          when 'exactly'
            correct = num == con.get 'value'
          when 'at most'
            correct = num <= con.get 'value'

        if !correct
          diff = con.get 'value' - num
          @todoItemModel.push @_createTodoItem(con, num)

    _updateCalendarConstraints: =>

    _updateTimeConstraints: =>

    _createTodoItem: =>

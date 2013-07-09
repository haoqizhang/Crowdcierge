do ->
  class com.uid.crowdcierge.TodoManager
    constructor: (options) ->
      _.extend @,
        Backbone.Events,
        options

      @itineraryModel = @session.itineraryModel
      @travelTimeModel = @session.travelTimeModel
      @constraintsModel = @session.constraintsModel
      @todoItemModel = @session.todoItemModel
      @currentTaskModel = @session.currentTaskModel

      @listenTo @itineraryModel, 'add change sort remove reset', @updateTodo
      @listenTo @constraintsModel, 'add remove reset', @updateTodo

    updateTodo: =>
      @todoItemModel.reset()
      @_updateActivityConstraints()
      @_updateCalendarConstraints()
      @_updateTimeConstraints()

    # FML
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
          obj = @_buildActivityTodoObject(con, num, diff)
          model = new Backbone.Model(obj)
          @todoItemModel.push model 

    _updateCalendarConstraints: =>
      blocks = []
      for model in @itineraryModel.models
        blocks.push 
          start: model.get('start')
          end: model.get('start') + parseInt(model.get('duration'))
      for checkBlock in blocks
        for block in blocks
          if block == checkBlock
            continue
          startOverlap = (checkBlock.start >= block.start and checkBlock.start < block.end)
          endOverlap = (checkBlock.end > block.start and checkBlock.end <= block.end)
          if startOverlap or endOverlap
            @_addOverlapTodo()
            return

    _updateTimeConstraints: =>

    _addOverlapTodo: =>
      model = new Backbone.Model
        name: 'Itinerary items are overlapping'
        categories: ['todo']
        description: 'Try to rearrange the items in the calendar so that none are overlapping.'
      
      @todoItemModel.push model

    _buildActivityTodoObject: (con, num, diff) =>
      ret = {}
      switch con.get('compare')
        when 'at most'
          err = 'Remove some \'' + con.get('cat') + '\' from the itinerary'
        when 'at least'
          err = 'Add more \'' + con.get('cat') + '\' to the itinerary'
        when 'exactly'
          if diff < 0
            err = 'Remove some \'' + con.get('cat') + '\' from the itinerary'
          else
            err = 'Add more \'' + con.get('cat') + '\' to the itinerary'

      ret.name = err
      ret.categories = ['todo', con.get('cat')]

      ret.description = ret.name
      return ret
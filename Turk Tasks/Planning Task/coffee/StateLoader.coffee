do ->
  _STATE_LOAD_URL = "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/loadTurkTourTaskState.php"

  class com.uid.crowdcierge.StateLoader
    constructor: (options) ->
      @session = options.session
      @currentTaskModel = @session.currentTaskModel
      @itineraryModel = @session.itineraryModel
      @constraintsModel = @session.constraintsModel
      @activitiesModel = @session.activitiesModel

    # Currently needs to load state async
    load: =>
      if not @currentTaskModel.get('tid')?
        console.error 'No tid param set'
        return

      $.ajax
        type: 'GET'
        dataType: 'json'
        url: _STATE_LOAD_URL
        data:
          type: 'turktour',
          id: @currentTaskModel.get('tid')
        async: false
        success: ((obj) =>
            @_processState(obj)
          )

    # Urg
    _processState: (meta) =>
      @currentTaskModel.set 'state', JSON.parse(meta.state)
      @currentTaskModel.set 'stateId', meta.stateId

      meta.state = JSON.parse meta.state
      itinerary = meta.state.itinerary
      itineraryTimes = meta.state.itineraryTimes

      for i in [0..itinerary.length-1]
        if itinerary[i].toString().indexOf('user') != -1
          itinerary[i] = itinerary[i].toString().substring(5)
        activity = @activitiesModel.get('items').get(itinerary[i])
        @itineraryModel.push activity

      @itineraryModel.sort()

      # Why
      @_processAdmin meta.state.admin

    # I'm sorry
    _processAdmin: (admin) =>
      @currentTaskModel.set admin

      for con in admin.constraints
        constraintModel = new com.uid.crowdcierge.Constraint con
        @constraintsModel.push constraintModel
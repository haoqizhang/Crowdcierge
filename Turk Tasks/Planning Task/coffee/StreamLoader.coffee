do ->
  _STREAM_LOAD_URL = "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/loadTurkTourStream.php"

  class com.uid.crowdcierge.StreamLoader
    constructor: (options) ->
      @session = options.session
      @currentTaskModel = @session.currentTaskModel
      @activitiesModel = @session.activitiesModel

    # Currently needs to load stream before state
    load: =>
      if not @currentTaskModel.get('tid')?
        console.error 'No tid param set'
        return

      $.ajax
        type: 'GET'
        dataType: 'json'
        url: _STREAM_LOAD_URL
        data:
          type: 'turktour',
          id: @currentTaskModel.get('tid')
        async: false
        success: ((obj) =>
            @_processStream(obj)
          )

    # I hate that this exists
    _processStream: (stream) =>
      for item in stream
        if not item.changeInfo?
          answer = JSON.parse item.answer
          if answer.type != 'activity'
            continue

          model = new com.uid.crowdcierge.Activity answer.data
          model.id = item.hitId
          @activitiesModel.get('items').unshift model

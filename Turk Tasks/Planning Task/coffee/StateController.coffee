do ->
  _SAVE_ITINERARY_URL = 'https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourItinerary.php'

  class com.uid.crowdcierge.StateController
    constructor: (options) ->
      _.extend @,
        options,
        Backbone.Events

      @itineraryModel = @session.itineraryModel
      @currentTaskModel = @session.currentTaskModel

      @listenTo @itineraryModel, 'add remove', @saveState

    saveState: =>
      itinerary = []
      for shit in @itineraryModel.models
        itinerary.push 'user_' + shit.id

      @currentTaskModel.get('state').itinerary = itinerary
      state = @currentTaskModel.get('state')

      $.ajax
        type: 'POST'
        url: _SAVE_ITINERARY_URL
        data:
          userId: 'lol'
          taskId: @currentTaskModel.get('tid')
          assignmentId: @currentTaskModel.get('assignmentId') ? ''
          answer: JSON.stringify(state)
          startState: @currentTaskModel.get('stateId')
          type: 'turktour'
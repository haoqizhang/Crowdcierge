do ->
  _EDIT_URL = 'https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourEdit.php'
  _ADD_URL = 'https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourEntry.php'

  class com.uid.crowdcierge.StreamController
    constructor: (options) ->
      _.extend @,
        options,
        Backbone.Events

      @activitiesModel = @session.activitiesModel
      @currentTaskModel = @session.currentTaskModel

      @listenTo @activitiesModel.get('items'), 'change', @_submitEdit
      @listenTo @activitiesModel.get('items'), 'add', @_submitAdd

    _submitEdit: (activity) =>
      submission = {}
      submission.data = activity.attributes
      submission.type = 'activity'
      $.ajax
        type: 'POST'
        url: _EDIT_URL
        data:
          userId: 'lol'
          taskId: @currentTaskModel.get('tid')
          assignmentId: @currentTaskModel.get('assignmentId') ? ''
          answer: JSON.stringify(activity.attributes)
          oldid: activity.id
          type: 'turktour'
        success: (data) =>
          data = data.replace(/(\r\n|\n|\r)/gm,'')
          activity.id = parseInt(data)
          @stateController.saveState()

    _submitAdd: (activity) =>
      $.ajax
        type: 'POST'
        url: _ADD_URL
        data:
          userId: 'lol'
          taskId: @currentTaskModel.get('tid')
          assignmentId: @currentTaskModel.get('assignmentId') ? ''
          answer: JSON.stringify(activity.attributes)
          type: 'turktour'
        success: (data) =>
          data = data.replace(/(\r\n|\n|\r)/gm,'')
          activity.id = parseInt(data)
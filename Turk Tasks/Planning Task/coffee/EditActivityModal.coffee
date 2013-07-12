do ->
  _CREATE_ACTIVITY_HEADER = 'Add New Activity Idea'
  _EDIT_ACTIVITY_HEADER = 'Edit Activity: '

  class com.uid.crowdcierge.EditActivityModal extends com.uid.crowdcierge.ModalView
    initialize: =>
      @activitiesModel = @options.activitiesModel
      @itineraryModel = @options.itineraryModel
      @currentTaskModel = @options.currentTaskModel

      @headerText = _CREATE_ACTIVITY_HEADER

    renderHeader: =>
      return $('<div/>').text(@headerText)

    renderContent: =>
      source = $('#edit-activity-template').html()
      template = Handlebars.compile(source)

      values = _.defaults 
        editable: @currentTaskModel.get('taskType') != 'preview'
        inItinerary: @itineraryModel.get(@activity.cid)?
        categories: @currentTaskModel.get('categories'),
        @activity.attributes

      $content = $(template(values))

      @$el.addClass('modal-fat')

      return $content

    prepMap: =>
      @map = L.map(@$('#editActivityMap')[0])

      L.tileLayer('http://{s}.tile.cloudmade.com/ebeae5620c954242916bfba0601e86d8/99953/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
      }).addTo(@map)

      startLoc = @currentTaskModel.get 'start'
      @map.setView [startLoc.lat, startLoc.long], 13, true

      @_configureActivityPin

    _configureActivityPin: =>
      # no-op EditActivityModal._configureActivityPin

  class com.uid.crowdcierge.CreateActivityModal extends com.uid.crowdcierge.EditActivityModal
    initialize: =>
      super()

      @activity = new com.uid.crowdcierge.Activity()
      @headerText = _CREATE_ACTIVITY_HEADER

    _configureActivityPin: =>
      startLoc = @currentTaskModel.get 'start'

      marker = L.marker [startLoc.lat, startLoc.long]
      marker.addTo @map

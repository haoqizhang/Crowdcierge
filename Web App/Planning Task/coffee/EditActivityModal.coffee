do ->
  _CREATE_ACTIVITY_HEADER = 'Add New Activity Idea'
  _EDIT_ACTIVITY_HEADER = 'Edit Activity: '
  _ACTIVITY_DURATION_OPTIONS = 
    [15, 30, 45, 60, 75, 90, 105, 120, 150, 180, 240, 300, 360, 420, 480]

  class com.uid.crowdcierge.EditActivityModal extends com.uid.crowdcierge.ModalView
    events:
      'click .save-activity': '_handleSaveActivity'

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

      if _ACTIVITY_DURATION_OPTIONS.indexOf(@activity.get('duration')) < 0 and @activity.get('duration') != 0
        _ACTIVITY_DURATION_OPTIONS.push(@activity.get('duration'))

      _ACTIVITY_DURATION_OPTIONS.sort (a,b) => return a-b

      values = _.defaults 
        editable: @currentTaskModel.get('taskType') != 'preview'
        inItinerary: @itineraryModel.get(@activity.cid)?
        categories: @currentTaskModel.get('categories')
        timeOptions: _ACTIVITY_DURATION_OPTIONS,
        @activity.attributes
      $content = $(template(values))

      if @activity.get('duration') > 0
        $content.find('select').val(@activity.get('duration')).attr('selected', true)

      for cat in @activity.get('categories')
        $content.find("input[value='#{cat}']").attr('checked', true)

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

      @_configureActivityPin()

    _checkFieldsEmpty: =>
      if @$('#editActivityName').val().trim() == ''
        err = true
        alert('Please enter a name for the activity')
      if @$('#editActivityLocation').val().trim() == ''
        err = true
        alert('Please enter a location for the activity')
      return err

    _configureActivityPin: =>
      # no-op EditActivityModal._configureActivityPin

    _handleSaveActivity: =>
      # no-op EditActivityModal._handleSaveActivity

  class com.uid.crowdcierge.CreateActivityModal extends com.uid.crowdcierge.EditActivityModal
    initialize: =>
      super()

      @activity = new com.uid.crowdcierge.Activity()
      @headerText = _CREATE_ACTIVITY_HEADER

    _configureActivityPin: =>
      startLoc = @currentTaskModel.get 'start'
      @marker = L.marker [startLoc.lat, startLoc.long],
        zIndexOffset: 10000
        draggable: true
      @marker.bindPopup 'New Activity'
      @marker.addTo @map
      @marker.openPopup()

    _handleSaveActivity: =>
      if @_checkFieldsEmpty()
        return

      data = 
        name: @$('#editActivityName').val().trim()
        description: @$('#editActivityDescription').val().trim()
        location:
          name: @$('#editActivityLocation').val().trim()
          lat: @marker.getLatLng().lat
          long: @marker.getLatLng().lng
        duration: @$('#editActivityDuration').find(":selected").val();
        categories: ($(input).val() for input in @$('input:checked'))

      @activity.set data
      @activitiesModel.get('items').add @activity

      @closeModal()

  class com.uid.crowdcierge.EditExistingActivityModal extends com.uid.crowdcierge.EditActivityModal
    initialize: =>
      super()

      @activity = @options.activity
      @headerText = _EDIT_ACTIVITY_HEADER + @activity.get('name')

    _configureActivityPin: =>
      latlng = [@activity.get('location').lat, @activity.get('location').long]
      @map.setView latlng, 13, true
      @marker = L.marker latlng,
        zIndexOffset: 10000
        draggable: true
      @marker.bindPopup @activity.get('name')
      @marker.addTo @map
      @marker.openPopup()

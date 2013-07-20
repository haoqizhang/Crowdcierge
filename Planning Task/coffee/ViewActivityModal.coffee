do ->
  _ACTIVITY_HEADER = 'Activity: '

  class com.uid.crowdcierge.ViewActivityModal extends com.uid.crowdcierge.ModalView
    events:
      'click .add-to-itinerary': '_addToItinerary'
      'click .remove-from-itinerary': '_removeFromItinerary'
      'click .edit-activity': '_editActivity'

    initialize: =>
      @activity = @options.activity
      @activitiesModel = @options.activitiesModel
      @itineraryModel = @options.itineraryModel
      @currentTaskModel = @options.currentTaskModel

    renderHeader: =>
      return $('<div/>').text(_ACTIVITY_HEADER + @activity.get('name'))

    renderContent: =>
      source = $('#view-activity-template').html()
      template = Handlebars.compile(source)

      values = _.defaults {editable: @currentTaskModel.get('taskType') != 'preview'},
        {inItinerary: @itineraryModel.get(@activity.cid)?},
        @activity.attributes

      $content = $(template(values))

      @$el.addClass('modal-fat')

      return $content

    prepMap: =>
      @map = L.map(@$('#viewActivityMap')[0])

      L.tileLayer('http://{s}.tile.cloudmade.com/ebeae5620c954242916bfba0601e86d8/99953/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
      }).addTo(@map)

      @map.setView([@activity.get('location').lat, 
        @activity.get('location').long], 13)

      marker = L.marker [@activity.get('location').lat
        , @activity.get('location').long], {zIndexOffset: 10000}
      marker.bindPopup @activity.get('name')
      marker.addTo @map
      marker.openPopup()

    _addToItinerary: =>
      @itineraryModel.add @activity
      @closeModal()

    _removeFromItinerary: =>
      @itineraryModel.remove @activity.cid
      @closeModal()

    _editActivity: =>
      @closeModal()
      modal = new com.uid.crowdcierge.EditExistingActivityModal
        activity: @activity
        activitiesModel: @activitiesModel
        itineraryModel: @itineraryModel
        currentTaskModel: @currentTaskModel
      modal.render()
      modal.prepMap()
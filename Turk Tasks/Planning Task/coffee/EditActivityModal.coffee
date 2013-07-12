do ->
  _ACTIVITY_HEADER = 'Activity: '

  class com.uid.crowdcierge.EditActivityModal extends com.uid.crowdcierge.ModalView
    events:
      'click .add-to-itinerary': '_addToItinerary'
      'click .remove-from-itinerary': '_removeFromItinerary'

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
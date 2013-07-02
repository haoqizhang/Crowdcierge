do ->
  _CIRCLE_MARKER_SIZE = 20

  class com.uid.crowdcierge.MapView extends Backbone.View
    className: 'map-view'

    initialize: =>
      @session = @options.session
      @activitiesModel = @session.activitiesModel
      @itineraryModel = @session.itineraryModel
      @currentTaskModel = @session.currentTaskModel

      @idToMarkerMap = {}

      @listenTo @itineraryModel, 'add remove reset', @_plotItinerary
      @listenTo @activitiesModel, 'change:selected', @_showSelectedActivity

    render: =>
      @$el.empty()

      source = $('#map-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template()

      @map = L.map(@$('#map')[0])

      L.tileLayer('http://{s}.tile.cloudmade.com/ebeae5620c954242916bfba0601e86d8/99953/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
      }).addTo(@map)

      @_plotStartEnd()
      @_plotItinerary()

    _plotStartEnd: =>
      startLoc = @currentTaskModel.get 'start'
      @map.setView [startLoc.lat, startLoc.long], 14, true

      startIcon = L.divIcon
        className: 'start-marker'
        iconSize: [_CIRCLE_MARKER_SIZE, _CIRCLE_MARKER_SIZE]

      startMarker = L.marker [startLoc.lat, startLoc.long]
        , {icon: startIcon, zIndexOffset: 100}
      startMarker.bindPopup 'Traveler\'s starting location'
      startMarker.addTo @map

      endLoc = @currentTaskModel.get 'end'
      endIcon = L.divIcon
        className: 'end-marker'
        iconSize: [_CIRCLE_MARKER_SIZE, _CIRCLE_MARKER_SIZE]

      endMarker = L.marker [endLoc.lat - 0.0001, endLoc.long - 0.0001]
        , {icon: endIcon}
      endMarker.bindPopup 'Traveler\'s ending location'
      endMarker.addTo @map

    _plotItinerary: =>
      @_plotItineraryPins()
      @_plotItineraryRoute()

    _plotItineraryPins: =>
      for marker in _.values(@idToMarkerMap)
        @map.removeLayer(marker)

      @idToMarkerMap = {}

      for model, i in @itineraryModel.models
        marker =  L.marker [model.get('location').lat, model.get('location').long]
          , {icon: new L.NumberedDivIcon({number: i+1}), zIndexOffset: 200}
        @idToMarkerMap[model.id] = marker
        marker.bindPopup @_getActivityPopupFromModel(model)
        marker.addTo @map

    _plotItineraryRoute: =>
      #TODO

    _showSelectedActivity: (list, activity) =>
      if activity?
        if @selectedMarker
          @map.removeLayer @selectedMarker
        @map.panTo([activity.get('location').lat
          , activity.get('location').long])
        if @idToMarkerMap[activity.id]?
          @idToMarkerMap[activity.id].openPopup()
        else
          @selectedMarker = L.marker [activity.get('location').lat
            , activity.get('location').long], {zIndexOffset: 1000}
          @selectedMarker.bindPopup @_getActivityPopupFromModel(activity)
          @selectedMarker.addTo @map
          @selectedMarker.openPopup()

    # I don't get why JQuery delegate doesn't work here, 
    # but I guess this will have to do.
    _getActivityPopupFromModel: (model) =>
      source = $('#map-popup-template').html()
      template = Handlebars.compile(source)

      inItinerary = @itineraryModel.get(model.cid)?

      $popup = $(template(_.defaults {inItinerary: inItinerary}, model))

      $popup.find('.view-item').click @_handleViewItemClick
      $popup.find('.edit-item').click @_handleEditItemClick
      $popup.find('.add-activity').click @_handleAddItemClick
      $popup.find('.remove-activity').click @_handleRemoveItemClick

      return $popup[0]

    _handleViewItemClick: (evt) =>
      id = $(evt.target).closest('.map-popup').attr('id')
      modal = new com.uid.crowdcierge.ViewActivityModal
        activity: @activitiesModel.get('items').get(id)
        activitiesModel: @activitiesModel
        itineraryModel: @itineraryModel
        currentTaskModel: @currentTaskModel
      modal.render()
      modal.prepMap()

    _handleEditItemClick: (evt) =>
      id = $(evt.target).closest('.map-popup').attr('id')

    _handleAddItemClick: (evt) =>
      id = $(evt.target).closest('.map-popup').attr('id')
      @itineraryModel.add @activitiesModel.get('items').get(id)

    _handleRemoveItemClick: (evt) =>
      id = $(evt.target).closest('.map-popup').attr('id')
      @itineraryModel.remove id

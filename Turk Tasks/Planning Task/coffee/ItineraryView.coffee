do ->
  class com.uid.crowdcierge.ItineraryView extends Backbone.View
    className: 'itinerary-view'

    initialize: =>
      @session = @options.session

    render: =>
      @$el.empty()

      source = $('#itinerary-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template()

      @calendar = new com.uid.crowdcierge.CalendarView
        currentTaskModel: @session.currentTaskModel
        itineraryModel: @session.itineraryModel
        travelTimeModel: @session.travelTimeModel
        activitiesModel: @session.activitiesModel

      @$el.append @calendar.$el
      @calendar.render()

  _SLOT_SIZE_MINUTES = 15
  _BACKGROUND_COLOR = '#D3F1F2'
  _CALENDAR_HEIGHT = 578
  _CALENDAR_OPTIONS =
    height: _CALENDAR_HEIGHT
    allDayDefault:false
    events: []
    allDaySlot: false
    slotMinutes: _SLOT_SIZE_MINUTES
    eventColor: "white",
    eventBorderColor: "gray",
    eventTextColor: "#000000"

  # Too many hacks below
  class com.uid.crowdcierge.CalendarView extends Backbone.View
    className: 'calendar-wrapper'

    initialize: =>
      @currentTaskModel = @options.currentTaskModel
      @itineraryModel = @options.itineraryModel
      @travelTimeModel = @options.travelTimeModel
      @activitiesModel = @options.activitiesModel

      @listenTo @itineraryModel, 'add', @_addEvent
      @listenTo @itineraryModel, 'remove', @_removeEvent
      @listenTo @itineraryModel, 'reset', @_resetEvents

    render: =>
      @$el.empty()

      source = $('#calendar-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template()
      @$calendar = @$('#calendar')

      @_getTripTimes()

      switch @currentTaskModel.get 'taskType'
        when 'replan', 'inProgress'
          @_initializeMidTripCalendar()
        else
          @_initializeStandardCalendar()

      @_resetEvents(@itineraryModel)

    _getTripTimes: =>
      if @currentTaskModel.get('endTime') > 1440
        @shift = (@currentTaskModel.get('endTime') - 1440) / 60
      else
        @shift = 0

      if @currentTaskModel.get('date')?
        tripDate = @currentTaskModel.get('date')
        y = Math.round(tripDate/10000);
        m = Math.round((tripDate % 10000) / 100) - 1;
        d = tripDate % 100;
        @date = new Date(y, m, d)
      else
        @date = new Date()

      startHours = @_hours @currentTaskModel.get('beginTime')
      startMin = @currentTaskModel.get('beginTime') % 60
      @date.setHours(startHours - @shift)
      @date.setMinutes(startMin)

    _initializeMidTripCalendar: =>
      # TODO

    _initializeStandardCalendar: =>
      begin = @currentTaskModel.get('beginTime') # - _SLOT_SIZE_MINUTES
      begin = begin/60 - @shift
      end = @currentTaskModel.get('endTime')/60 - @shift

      @$calendar.fullCalendar(_.defaults(
        minTime: begin
        maxTime: end
        editable: !(@currentTaskModel.get('taskType') == 'preview')
        eventDrop: @_eventDrop
        eventResize: @_eventResize
        eventClick: @_eventClick
        #eventRender: @_renderEvent
        , _CALENDAR_OPTIONS))

      @_modifyCalendarView()

    _modifyCalendarView: =>
      @$calendar.fullCalendar('changeView', 'agendaDay')
      
      # @$('.fc-slot0 .fc-widget-content div').text('Start');
      # source = $('#end-calendar-template').html()
      # template = Handlebars.compile(source)
      # $end = $(template())
      # @$('.fc-agenda-slots tbody').append $end

    _addEvent: (model) =>
      startDate = new Date(@date)
      if model.get('start') != 0
        startDate.setHours @_hours(model.get('start'))
        startDate.setMinutes model.get('start')%60

      endDate = new Date(@date)
      endDate.setHours @_hours(model.get('duration')) + startDate.getHours()
      endDate.setMinutes model.get('duration')%60 + startDate.getMinutes()

      evt = 
        id: model.id
        title: model.get('name')
        start: startDate
        end: endDate
      @$calendar.fullCalendar('renderEvent', evt, true)

    _removeEvent: (model) =>
      @$calendar.fullCalendar('removeEvents', model.id)
      model.set 'start', 0

    _resetEvents: (collection) =>
      @$calendar.fullCalendar('removeEvents')
      for model in collection.models
        @_addEvent(model)

    _eventResize: (evt, days, minutes) =>
      model = @itineraryModel.get(evt.id)
      oldDuration = model.get 'duration'
      model.set 'duration', oldDuration + minutes

    _eventDrop: (evt, days, minutes) =>
      model = @itineraryModel.get(evt.id)
      oldStart = model.get 'start'
      model.set 'start', oldStart + minutes

    _eventClick: (evt) =>
      @activitiesModel.set 'selected', @itineraryModel.get(evt.id)

    _hours: (min) =>
      return Math.floor(min/60)
do ->
  _SLOT_SIZE_MINUTES = 15
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

  # Too many hacks below
  class com.uid.crowdcierge.CalendarView extends Backbone.View
    className: 'calendar-wrapper'

    events:
      'click .event-close': '_clickRemoveEvent'
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
      @$el.append $('<div id="calendar"/>')
      @$calendar = @$('#calendar')

      @_getTripTimes()

      switch @currentTaskModel.get 'taskType'
        when 'replan', 'inProgress'
          @_initializeMidTripCalendar()
        else
          @_initializeStandardCalendar()

      @_resetEvents(@itineraryModel)

      @_shiftTableTimes()

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
      begin = @currentTaskModel.get('beginTime')
      begin = begin/60 - @shift
      end = @currentTaskModel.get('endTime')/60 - @shift

      @$calendar.fullCalendar(_.defaults(
        minTime: begin
        maxTime: end
        editable: !(@currentTaskModel.get('taskType') == 'preview')
        eventDrop: @_eventDrop
        eventResize: @_eventResize
        eventClick: @_eventClick
        eventRender: @_renderEvent
        , _CALENDAR_OPTIONS))

      @_modifyCalendarView()

    _modifyCalendarView: =>
      @$calendar.fullCalendar('changeView', 'agendaDay')

    _addEvent: (model) =>
      startDate = new Date(@date)
      if model.get('start') == 0
        model.set 'start', (@currentTaskModel.get('beginTime') - @shift*60)

      startDate.setHours @_hours(model.get('start'))
      startDate.setMinutes model.get('start')%60

      endDate = new Date(@date)
      endDate.setHours @_hours(model.get('duration')) + startDate.getHours()
      endDate.setMinutes model.get('duration')%60 + startDate.getMinutes()

      evt = 
        id: model.cid
        title: model.get('name')
        start: startDate
        end: endDate
      @$calendar.fullCalendar('renderEvent', evt, true)

    _removeEvent: (model) =>
      @$calendar.fullCalendar('removeEvents', model.cid)

    _resetEvents: (collection) =>
      @$calendar.fullCalendar('removeEvents')
      for model in collection.models
        @_addEvent(model)

    _eventResize: (evt, days, minutes, revert) =>
      model = @itineraryModel.get(evt.id)
      newDuration = parseInt(model.get('duration')) + minutes
      newEnd = model.get('start') + newDuration
      if newEnd > @currentTaskModel.get('endTime') - @shift*60
        revert()
      else
        model.set 'duration', newDuration

    _eventDrop: (evt, days, minutes, allDay, revert) =>
      model = @itineraryModel.get(evt.id)
      newStart = model.get('start') + minutes
      newEnd = newStart + parseInt(model.get('duration'))
      if newStart < @currentTaskModel.get('beginTime') - @shift*60 or newEnd > @currentTaskModel.get('endTime') - @shift*60
        revert()
      else
        model.set 'start', newStart
        @itineraryModel.sort()

    _eventClick: (evt) =>
      @activitiesModel.set 'selected', @itineraryModel.get(evt.id)

    _renderEvent: (evt, $element) =>
      $close = $('<div class="event-close"/>').html('&times;')
      $close.attr('eventId', evt.id)

      model = @itineraryModel.get(evt.id)

      source = $('#itinerary-item-template').html()
      template = Handlebars.compile(source)
      $eventBody = $(template(
        _.defaults {ind: @itineraryModel.indexOf(model)+1}, model.attributes
        ))

      $element.find('.fc-event-content').empty().append $eventBody
      $element.find('.fc-event-head').append $close
      @_shiftEventTimes()
      return $element

    _clickRemoveEvent: (evt) =>
      evt.stopPropagation()
      @itineraryModel.remove $(evt.target).attr('eventId')

    _hours: (min) =>
      return Math.floor(min/60)

    # I will go to hell for this
    _shiftTableTimes: =>
      slotNum = (@currentTaskModel.get('endTime') - @currentTaskModel.get('beginTime'))/_SLOT_SIZE_MINUTES
      for s in [0..slotNum-1]
        oldTimes = @$(".fc-slot" + s).html()
        newTimes = oldTimes
        if newTimes 
          for i in [0..12]
            up = i + @shift
            up = up%12
            if i > up and i != 12
              if up == 0 
                up = 12
              newTimes = newTimes.replace(">" + i + "pm", ">" + up + "AM")
              newTimes = newTimes.replace(">" + i + "am", ">" + up + "PM")
            else 
              if up == 0
                up = 12
              newTimes = newTimes.replace(">" + i + "pm", ">" + up + "PM")
              newTimes = newTimes.replace(">" + i + "am", ">" + up + "AM")
          newTimes = newTimes.replace("AM", "am")
          newTimes = newTimes.replace("PM", "pm")                  
          @$(".fc-slot" + s).html(newTimes)

    # I will go to hell again for this too
    _shiftEventTimes: =>
      times = @$(".fc-event-time")
      for t in [0..(times.size()-1)]
        oldTimes = $(times[t]).parent().html()
        newTimes = oldTimes
        if newTimes
          for i in [0..12]
            up = i + @shift;
            if up > 12
              up = up - 12
            newTimes = newTimes.replace(">" + i + ":", "> " + up + ":")
            newTimes = newTimes.replace(">" + i + ":", "> " + up + ":")
            newTimes = newTimes.replace("- " + i + ":", " -  " + up + ":")
            newTimes = newTimes.replace("- " + i + ":", " -  " + up + ":")
          $(times[t]).parent().html(newTimes)
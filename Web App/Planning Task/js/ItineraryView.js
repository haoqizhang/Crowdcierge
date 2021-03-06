(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var _CALENDAR_HEIGHT, _CALENDAR_OPTIONS, _SLOT_SIZE_MINUTES, _ref, _ref1;
    _SLOT_SIZE_MINUTES = 15;
    _CALENDAR_HEIGHT = 578;
    _CALENDAR_OPTIONS = {
      height: _CALENDAR_HEIGHT,
      allDayDefault: false,
      events: [],
      allDaySlot: false,
      slotMinutes: _SLOT_SIZE_MINUTES,
      eventColor: "white",
      eventBorderColor: "gray",
      eventTextColor: "#000000"
    };
    com.uid.crowdcierge.ItineraryView = (function(_super) {
      __extends(ItineraryView, _super);

      function ItineraryView() {
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        _ref = ItineraryView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ItineraryView.prototype.className = 'itinerary-view';

      ItineraryView.prototype.initialize = function() {
        return this.session = this.options.session;
      };

      ItineraryView.prototype.render = function() {
        var source, template;
        this.$el.empty();
        source = $('#itinerary-view-template').html();
        template = Handlebars.compile(source);
        this.$el.html(template());
        this.calendar = new com.uid.crowdcierge.CalendarView({
          currentTaskModel: this.session.currentTaskModel,
          itineraryModel: this.session.itineraryModel,
          travelTimeModel: this.session.travelTimeModel,
          activitiesModel: this.session.activitiesModel
        });
        this.$el.append(this.calendar.$el);
        return this.calendar.render();
      };

      return ItineraryView;

    })(Backbone.View);
    return com.uid.crowdcierge.CalendarView = (function(_super) {
      __extends(CalendarView, _super);

      function CalendarView() {
        this._shiftEventTimes = __bind(this._shiftEventTimes, this);
        this._shiftTableTimes = __bind(this._shiftTableTimes, this);
        this._hours = __bind(this._hours, this);
        this._clickRemoveEvent = __bind(this._clickRemoveEvent, this);
        this._renderEvent = __bind(this._renderEvent, this);
        this._eventClick = __bind(this._eventClick, this);
        this._eventDrop = __bind(this._eventDrop, this);
        this._eventResize = __bind(this._eventResize, this);
        this._resetEvents = __bind(this._resetEvents, this);
        this._removeEvent = __bind(this._removeEvent, this);
        this._addEvent = __bind(this._addEvent, this);
        this._modifyCalendarView = __bind(this._modifyCalendarView, this);
        this._initializeStandardCalendar = __bind(this._initializeStandardCalendar, this);
        this._initializeMidTripCalendar = __bind(this._initializeMidTripCalendar, this);
        this._getTripTimes = __bind(this._getTripTimes, this);
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        _ref1 = CalendarView.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      CalendarView.prototype.className = 'calendar-wrapper';

      CalendarView.prototype.events = {
        'click .event-close': '_clickRemoveEvent'
      };

      CalendarView.prototype.initialize = function() {
        this.currentTaskModel = this.options.currentTaskModel;
        this.itineraryModel = this.options.itineraryModel;
        this.travelTimeModel = this.options.travelTimeModel;
        this.activitiesModel = this.options.activitiesModel;
        this.listenTo(this.itineraryModel, 'add', this._addEvent);
        this.listenTo(this.itineraryModel, 'remove', this._removeEvent);
        return this.listenTo(this.itineraryModel, 'reset', this._resetEvents);
      };

      CalendarView.prototype.render = function() {
        this.$el.empty();
        this.$el.append($('<div id="calendar"/>'));
        this.$calendar = this.$('#calendar');
        this._getTripTimes();
        switch (this.currentTaskModel.get('taskType')) {
          case 'replan':
          case 'inProgress':
            this._initializeMidTripCalendar();
            break;
          default:
            this._initializeStandardCalendar();
        }
        this._resetEvents(this.itineraryModel);
        return this._shiftTableTimes();
      };

      CalendarView.prototype._getTripTimes = function() {
        var d, m, startHours, startMin, tripDate, y;
        if (this.currentTaskModel.get('endTime') > 1440) {
          this.shift = (this.currentTaskModel.get('endTime') - 1440) / 60;
        } else {
          this.shift = 0;
        }
        if (this.currentTaskModel.get('date') != null) {
          tripDate = this.currentTaskModel.get('date');
          y = Math.round(tripDate / 10000);
          m = Math.round((tripDate % 10000) / 100) - 1;
          d = tripDate % 100;
          this.date = new Date(y, m, d);
        } else {
          this.date = new Date();
        }
        startHours = this._hours(this.currentTaskModel.get('beginTime'));
        startMin = this.currentTaskModel.get('beginTime') % 60;
        this.date.setHours(startHours - this.shift);
        return this.date.setMinutes(startMin);
      };

      CalendarView.prototype._initializeMidTripCalendar = function() {};

      CalendarView.prototype._initializeStandardCalendar = function() {
        var begin, end;
        begin = this.currentTaskModel.get('beginTime');
        begin = begin / 60 - this.shift;
        end = this.currentTaskModel.get('endTime') / 60 - this.shift;
        this.$calendar.fullCalendar(_.defaults({
          minTime: begin,
          maxTime: end,
          editable: !(this.currentTaskModel.get('taskType') === 'preview'),
          eventDrop: this._eventDrop,
          eventResize: this._eventResize,
          eventClick: this._eventClick,
          eventRender: this._renderEvent
        }, _CALENDAR_OPTIONS));
        return this._modifyCalendarView();
      };

      CalendarView.prototype._modifyCalendarView = function() {
        return this.$calendar.fullCalendar('changeView', 'agendaDay');
      };

      CalendarView.prototype._addEvent = function(model) {
        var endDate, evt, startDate;
        startDate = new Date(this.date);
        if (model.get('start') === 0) {
          model.set('start', this.currentTaskModel.get('beginTime') - this.shift * 60);
        }
        startDate.setHours(this._hours(model.get('start')));
        startDate.setMinutes(model.get('start') % 60);
        endDate = new Date(this.date);
        endDate.setHours(this._hours(model.get('duration')) + startDate.getHours());
        endDate.setMinutes(model.get('duration') % 60 + startDate.getMinutes());
        evt = {
          id: model.cid,
          title: model.get('name'),
          start: startDate,
          end: endDate
        };
        return this.$calendar.fullCalendar('renderEvent', evt, true);
      };

      CalendarView.prototype._removeEvent = function(model) {
        return this.$calendar.fullCalendar('removeEvents', model.cid);
      };

      CalendarView.prototype._resetEvents = function(collection) {
        var model, _i, _len, _ref2, _results;
        this.$calendar.fullCalendar('removeEvents');
        _ref2 = collection.models;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          model = _ref2[_i];
          _results.push(this._addEvent(model));
        }
        return _results;
      };

      CalendarView.prototype._eventResize = function(evt, days, minutes, revert) {
        var model, newDuration, newEnd;
        model = this.itineraryModel.get(evt.id);
        newDuration = parseInt(model.get('duration')) + minutes;
        newEnd = model.get('start') + newDuration;
        if (newEnd > this.currentTaskModel.get('endTime') - this.shift * 60) {
          return revert();
        } else {
          return model.set('duration', newDuration);
        }
      };

      CalendarView.prototype._eventDrop = function(evt, days, minutes, allDay, revert) {
        var model, newEnd, newStart;
        model = this.itineraryModel.get(evt.id);
        newStart = model.get('start') + minutes;
        newEnd = newStart + parseInt(model.get('duration'));
        if (newStart < this.currentTaskModel.get('beginTime') - this.shift * 60 || newEnd > this.currentTaskModel.get('endTime') - this.shift * 60) {
          return revert();
        } else {
          model.set('start', newStart);
          return this.itineraryModel.sort();
        }
      };

      CalendarView.prototype._eventClick = function(evt) {
        this.activitiesModel.set('selected', null);
        return this.activitiesModel.set('selected', this.itineraryModel.get(evt.id));
      };

      CalendarView.prototype._renderEvent = function(evt, $element) {
        var $close, $eventBody, model, source, template;
        $close = $('<div class="event-close"/>').html('&times;');
        $close.attr('eventId', evt.id);
        model = this.itineraryModel.get(evt.id);
        source = $('#itinerary-item-template').html();
        template = Handlebars.compile(source);
        $eventBody = $(template(_.defaults({
          ind: this.itineraryModel.indexOf(model) + 1
        }, model.attributes)));
        $element.find('.fc-event-content').empty().append($eventBody);
        $element.find('.fc-event-head').append($close);
        this._shiftEventTimes();
        return $element;
      };

      CalendarView.prototype._clickRemoveEvent = function(evt) {
        evt.stopPropagation();
        return this.itineraryModel.remove($(evt.target).attr('eventId'));
      };

      CalendarView.prototype._hours = function(min) {
        return Math.floor(min / 60);
      };

      CalendarView.prototype._shiftTableTimes = function() {
        var i, newTimes, oldTimes, s, slotNum, up, _i, _j, _ref2, _results;
        slotNum = (this.currentTaskModel.get('endTime') - this.currentTaskModel.get('beginTime')) / _SLOT_SIZE_MINUTES;
        _results = [];
        for (s = _i = 0, _ref2 = slotNum - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; s = 0 <= _ref2 ? ++_i : --_i) {
          oldTimes = this.$(".fc-slot" + s).html();
          newTimes = oldTimes;
          if (newTimes) {
            for (i = _j = 0; _j <= 12; i = ++_j) {
              up = i + this.shift;
              up = up % 12;
              if (i > up && i !== 12) {
                if (up === 0) {
                  up = 12;
                }
                newTimes = newTimes.replace(">" + i + "pm", ">" + up + "AM");
                newTimes = newTimes.replace(">" + i + "am", ">" + up + "PM");
              } else {
                if (up === 0) {
                  up = 12;
                }
                newTimes = newTimes.replace(">" + i + "pm", ">" + up + "PM");
                newTimes = newTimes.replace(">" + i + "am", ">" + up + "AM");
              }
            }
            newTimes = newTimes.replace("AM", "am");
            newTimes = newTimes.replace("PM", "pm");
            _results.push(this.$(".fc-slot" + s).html(newTimes));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      CalendarView.prototype._shiftEventTimes = function() {
        var i, newTimes, oldTimes, t, times, up, _i, _j, _ref2, _results;
        times = this.$(".fc-event-time");
        _results = [];
        for (t = _i = 0, _ref2 = times.size() - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; t = 0 <= _ref2 ? ++_i : --_i) {
          oldTimes = $(times[t]).parent().html();
          newTimes = oldTimes;
          if (newTimes) {
            for (i = _j = 0; _j <= 12; i = ++_j) {
              up = i + this.shift;
              if (up > 12) {
                up = up - 12;
              }
              newTimes = newTimes.replace(">" + i + ":", "> " + up + ":");
              newTimes = newTimes.replace(">" + i + ":", "> " + up + ":");
              newTimes = newTimes.replace("- " + i + ":", " -  " + up + ":");
              newTimes = newTimes.replace("- " + i + ":", " -  " + up + ":");
            }
            _results.push($(times[t]).parent().html(newTimes));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return CalendarView;

    })(Backbone.View);
  })();

}).call(this);

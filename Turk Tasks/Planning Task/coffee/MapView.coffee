do ->
  class com.uid.crowdcierge.MapView extends Backbone.View
    className: 'map-view'

    initialize: =>
      @session = @options.session

    render: =>
      @$el.empty()

      source = $('#map-view-template').html()
      template = Handlebars.compile(source)
      @$el.html template()

      map = L.map(@$('#map')[0])

      L.tileLayer('http://{s}.tile.cloudmade.com/ebeae5620c954242916bfba0601e86d8/1/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
      }).addTo(map)

      map.setView([51.505, -0.09], 10, true)
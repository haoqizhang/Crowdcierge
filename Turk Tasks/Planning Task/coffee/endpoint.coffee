$('document').ready ( =>
  readUrlParameters()

  loadTaskState()
  loadStream()

  initMap()
  initActMap()

  loadStateIntoInterface()

  $(window).resize ->
    map?.Resize()
    setTimeout map?.SetCenter(map.GetCenter()), 1000

  prepareSearchBox()
  
  prepCalendar()

  showExplanationBox()

  ################
  # The good stuff
  ################

  if $.browser.msie
    alert "IE Error."

  session = new com.uid.crowdcierge.Session
  urlParser = new com.uid.crowdcierge.UrlParser
    session: session
  urlParser.readUrlParameters()

  # Stream must be loaded before state
  streamLoader = new com.uid.crowdcierge.StreamLoader
    session: session
  streamLoader.load()

  stateLoader = new com.uid.crowdcierge.StateLoader
    session: session
  stateLoader.load()

  #TODO: create controllers

  view = new com.uid.crowdcierge.MainView
    session: session
  view.render()

  console.log session
)

prepareSearchBox = ->
  $sb = $("#searchBox")
  $sb.bind 'keypress', ((e) ->
    code = e.keyCode
    if code == 13
      addSelect())

  $sb.focus ->
    if $sb.val() == emptyText
      $sb.val ''
      $sb.css 'color', 'gray'
  $sb.blur ->
    if $sb.val() == ''
      $sb.val emptyText
      $sb.css 'color', 'black'

$.ui.autocomplete.prototype._renderItem = (ul, item) ->
  re = new RegExp("^" + this.term);
  t = item.label.replace(re, "<span style='font-weight:bold;color:Blue;'>" + this.term + "</span>");
  return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.value + "</a>").appendTo(ul);

searchAutocomplete = $('#searchBox').autocomplete
      minLength: 2,
      source: userStream,
      select: (event, ui) -> 
          item = ui.item;
          $('#searchBox').val(item.value);
          openItem(item);
          return false;
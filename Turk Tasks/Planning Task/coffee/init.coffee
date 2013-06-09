do ->
  $('document').ready ( =>
    readUrlParameters()
    loadTaskState()
    loadUserData()
    initMap()
    loadStream()
    loadStateIntoInterface()
    initActMap()

    if $.browser.msie
      alert "IE Error."

    $(window).resize ->
      map?.Resize()
      setTimeout map?.SetCenter(map.GetCenter()), 1000

    prepareSearchBox()
    
    prepCalendar()
  
    showExplanationBox()
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

    readySearchBox()

  $.ui.autocomplete.prototype._renderItem = (ul, item) ->
    re = new RegExp("^" + this.term);
    t = item.label.replace(re, "<span style='font-weight:bold;color:Blue;'>" + this.term + "</span>");
    return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.value + "</a>").appendTo(ul);
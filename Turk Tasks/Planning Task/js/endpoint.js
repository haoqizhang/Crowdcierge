// Generated by CoffeeScript 1.6.2
(function() {
  var prepareSearchBox, searchAutocomplete,
    _this = this;

  $('document').ready((function() {
    var session, stateLoader;

    readUrlParameters();
    loadTaskState();
    loadStream();
    initMap();
    initActMap();
    loadStateIntoInterface();
    if ($.browser.msie) {
      alert("IE Error.");
    }
    $(window).resize(function() {
      if (typeof map !== "undefined" && map !== null) {
        map.Resize();
      }
      return setTimeout(typeof map !== "undefined" && map !== null ? map.SetCenter(map.GetCenter()) : void 0, 1000);
    });
    prepareSearchBox();
    prepCalendar();
    showExplanationBox();
    session = new com.uid.crowdcierge.Session;
    stateLoader = new com.uid.crowdcierge.StateLoader({
      session: session
    });
    return stateLoader.load();
  }));

  prepareSearchBox = function() {
    var $sb;

    $sb = $("#searchBox");
    $sb.bind('keypress', (function(e) {
      var code;

      code = e.keyCode;
      if (code === 13) {
        return addSelect();
      }
    }));
    $sb.focus(function() {
      if ($sb.val() === emptyText) {
        $sb.val('');
        return $sb.css('color', 'gray');
      }
    });
    return $sb.blur(function() {
      if ($sb.val() === '') {
        $sb.val(emptyText);
        return $sb.css('color', 'black');
      }
    });
  };

  $.ui.autocomplete.prototype._renderItem = function(ul, item) {
    var re, t;

    re = new RegExp("^" + this.term);
    t = item.label.replace(re, "<span style='font-weight:bold;color:Blue;'>" + this.term + "</span>");
    return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.value + "</a>").appendTo(ul);
  };

  searchAutocomplete = $('#searchBox').autocomplete({
    minLength: 2,
    source: userStream,
    select: function(event, ui) {
      var item;

      item = ui.item;
      $('#searchBox').val(item.value);
      openItem(item);
      return false;
    }
  });

}).call(this);

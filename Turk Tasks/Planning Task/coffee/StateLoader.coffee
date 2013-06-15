do ->
  _STATE_LOAD_URL = "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/loadTurkTourTaskState.php"

  class com.uid.crowdcierge.StateLoader
    constructor: (options) ->
      @session = options.session
      @currentTaskModel = @session.currentTaskModel

    # Currently needs to load state async
    load: =>
      @_readUrlParameters()
      console.log @currentTaskModel
      if not @currentTaskModel.get('tid')?
        console.error 'NO TASK ID SET.'
        return

      $.ajax
        type: 'GET'
        url: _STATE_LOAD_URL
        data:
          type: 'turktour',
          id: @currentTaskModel.get('tid')
        async: false
        success: ((obj) =>
            console.log obj
          )


    _readUrlParameters: =>
      params = @_getUrlParams();

      @currentTaskModel.set params

    _getUrlParams: =>
      params = {}
      m = window.location.href.match(/[\\?&]([^=]+)=([^&#]*)/g)
      console.log m
      if m?
        for i in [0..m.length-1]
          a = m[i].match(/.([^=]+)=(.*)/)
          params[@_unescapeUrl a[1]] = @_unescapeUrl a[2]        
      return params

    _unescapeUrl: (s) =>
      return decodeURIComponent(s.replace /\+/g, "%20" )
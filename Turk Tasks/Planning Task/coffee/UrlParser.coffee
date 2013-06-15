do ->
  class com.uid.crowdcierge.UrlParser
    constructor: (options) ->
      @session = options.session
      @currentTaskModel = @session.currentTaskModel

    readUrlParameters: =>
      params = @_getUrlParams();

      @currentTaskModel.set params
      @currentTaskModel.set 'changed', false

      if not params.assignmentId?
        @currentTaskModel.set 'taskType', 'admin'
      else if params.assignmentId == "ASSIGNMENT_ID_NOT_AVAILABLE"
        @currentTaskModel.set 'taskType', 'preview'
      else
        @currentTaskModel.set 'taskType', 'task'

    _getUrlParams: =>
      params = {}
      m = window.location.href.match(/[\\?&]([^=]+)=([^&#]*)/g)
      if m?
        for i in [0..m.length-1]
          a = m[i].match(/.([^=]+)=(.*)/)
          params[@_unescapeUrl a[1]] = @_unescapeUrl a[2]        
      return params

    _unescapeUrl: (s) =>
      return decodeURIComponent(s.replace /\+/g, "%20" )
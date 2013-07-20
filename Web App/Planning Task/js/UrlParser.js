(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    return com.uid.crowdcierge.UrlParser = (function() {
      function UrlParser(options) {
        this._unescapeUrl = __bind(this._unescapeUrl, this);
        this._getUrlParams = __bind(this._getUrlParams, this);
        this.readUrlParameters = __bind(this.readUrlParameters, this);
        this.session = options.session;
        this.currentTaskModel = this.session.currentTaskModel;
      }

      UrlParser.prototype.readUrlParameters = function() {
        var params;
        params = this._getUrlParams();
        this.currentTaskModel.set(params);
        this.currentTaskModel.set('changed', false);
        if (params.assignmentId == null) {
          return this.currentTaskModel.set('taskType', 'admin');
        } else if (params.assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE") {
          return this.currentTaskModel.set('taskType', 'preview');
        } else {
          return this.currentTaskModel.set('taskType', 'task');
        }
      };

      UrlParser.prototype._getUrlParams = function() {
        var a, i, m, params, _i, _ref;
        params = {};
        m = window.location.href.match(/[\\?&]([^=]+)=([^&#]*)/g);
        if (m != null) {
          for (i = _i = 0, _ref = m.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            a = m[i].match(/.([^=]+)=(.*)/);
            params[this._unescapeUrl(a[1])] = this._unescapeUrl(a[2]);
          }
        }
        return params;
      };

      UrlParser.prototype._unescapeUrl = function(s) {
        return decodeURIComponent(s.replace(/\+/g, "%20"));
      };

      return UrlParser;

    })();
  })();

}).call(this);

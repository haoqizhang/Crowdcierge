(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var _STREAM_LOAD_URL;
    _STREAM_LOAD_URL = "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/loadTurkTourStream.php";
    return com.uid.crowdcierge.StreamLoader = (function() {
      function StreamLoader(options) {
        this._processStream = __bind(this._processStream, this);
        this.load = __bind(this.load, this);
        this.session = options.session;
        this.currentTaskModel = this.session.currentTaskModel;
        this.activitiesModel = this.session.activitiesModel;
      }

      StreamLoader.prototype.load = function() {
        var _this = this;
        if (this.currentTaskModel.get('tid') == null) {
          console.error('No tid param set');
          return;
        }
        return $.ajax({
          type: 'GET',
          dataType: 'json',
          url: _STREAM_LOAD_URL,
          data: {
            type: 'turktour',
            id: this.currentTaskModel.get('tid')
          },
          async: false,
          success: (function(obj) {
            return _this._processStream(obj);
          })
        });
      };

      StreamLoader.prototype._processStream = function(stream) {
        var answer, item, model, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = stream.length; _i < _len; _i++) {
          item = stream[_i];
          if (item.changeInfo == null) {
            answer = JSON.parse(item.answer);
            if ((answer.type != null) && answer.type !== 'activity') {
              continue;
            }
            if (answer.data != null) {
              model = new com.uid.crowdcierge.Activity(answer.data);
            } else {
              model = new com.uid.crowdcierge.Activity(answer);
            }
            model.id = parseInt(item.hitId);
            _results.push(this.activitiesModel.get('items').unshift(model));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return StreamLoader;

    })();
  })();

}).call(this);

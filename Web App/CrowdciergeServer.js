(function() {
  var PORT, app, authController, express, http, server, tripController,
    _this = this;

  PORT = 5190;

  express = require('express');

  http = require('http');

  app = express();

  app.configure(function() {
    return app.use(express.bodyParser());
  });

  server = http.createServer(app);

  tripController = require('./TripController');

  tripController.bindHandlers(app);

  authController = require('./AuthController');

  authController.bindHandlers(app);

  app.use(express["static"](__dirname));

  server.listen(PORT);

  console.log('Crowdcierge server started on port ' + PORT);

}).call(this);

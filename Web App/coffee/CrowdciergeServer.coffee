PORT = 5190

express = require 'express'
http = require 'http'
app = express()
server = http.createServer app

app.get('/')

app.use(express.static(__dirname))
server.listen PORT

console.log 'Crowdcierge server started on port ' + PORT
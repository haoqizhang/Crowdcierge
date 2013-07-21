mysql = require 'mysql'
connection = mysql.createConnection
  host: 'mysql.csail.mit.edu'
  user: 'jrafidi'
  password: 'crowdcierge'
  database: 'crowdcierge'

format = require 'format'

class MysqlDAO
  mysql = require 'mysql'

  executeQuery: (query, values, callback) =>
    connection.connect()

    interpolatedQuery = format.vsprintf query, values
    connection.query interpolatedQuery, ((err, rows, fields) => 
        if err
          console.log "Error on SQL query #{interpolatedQuery}"
          throw err
        else
          callback?(rows, fields)
      )
    
    connection.end()

module.exports = MysqlDAO
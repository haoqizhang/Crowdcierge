CREATE_TRIP = "insert into trips ("

MysqlDAO = require './MysqlDAO'
class TripDAO extends MysqlDAO
  createTrip: (data) =>
    values = (JSON.stringify(val) for key,val of data)
CREATE_USER = "insert into users (email, password) values ('%s', '%s')"

MysqlDAO = require './MysqlDAO'
class AuthDAO extends MysqlDAO
  createUser: (data, callback) =>
    values = []
    values.push data.email

    # For now, users have no password
    values.push 'NoPassword'

    @executeQuery CREATE_USER, values, ((rows, fields) =>
        callback(rows.insertId)
      )

  loginUser: (data, callback) =>
    callback('TODO')

  getAllUsers: (data, callback) =>
    callback('TODO')

module.exports = AuthDAO
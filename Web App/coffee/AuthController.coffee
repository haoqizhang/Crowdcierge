AuthDAO = require './AuthDAO'
authDAO = new AuthDAO()

module.exports.bindHandlers = ((app) =>  
  app.get('/users', (req, res) =>
    if req.body.login?
      authDAO.loginUser(req.body, (id) =>
          res.send(id.toString())
        )
    else
      authDAO.getAllUsers((users) =>
          res.send(users)
        )
    )

  app.post('/users', (req, res) =>
    data = req.body
    authDAO.createUser(data, (id) =>
        res.send(id.toString())
      )
    )
)
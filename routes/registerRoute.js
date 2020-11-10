const express = require('express')
const app = express.Router()
const db = require('../controller/dbController')
const { salt } = require('../helper/bcryptHelper')
const routeErrorHandler = require('../middleware/errorHandler')


app.post('/auth/register', (req, res, next) => {
  const password = req.body.password
  salt(password)
    .then(hashedPassword => {
      req.body.password = hashedPassword
      // req.body.createdAt = new Date().toISOString()
      // req.body.updatedAt = new Date().toISOString()
      return db.add('users', req.body)
      }
    )
    .then(addUserResult => {
      if (addUserResult) {
        res.send(addUserResult)
      } else {
        res.status(400).send('Wrong body')
      }
    })
    .catch(err => {
      next(err)
    })
})


app.use(routeErrorHandler)

module.exports = app
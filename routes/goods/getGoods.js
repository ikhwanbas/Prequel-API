const express = require('express')
const app = express.Router()
const db = require('../../controller/dbController')
const passport = require('../../middleware/authorizationMiddleware')
const routeErrorHandler = require('../../middleware/errorMiddleware')

app.use(passport.authenticate('bearer', { session: false }))

app.get('/goods', (req, res, next) => {
  const query = req.query
  const id = req.user.id
  query.userId = id
  db.get('goods', query)
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      next(err)
    })
})

app.use(routeErrorHandler)

module.exports = app
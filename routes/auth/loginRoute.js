const express = require('express')
const app = express.Router()
const db = require('../../controller/dbController')
const jwt = require('jsonwebtoken')
const routeErrorHandler = require('../../middleware/errorHandler')
const { checkPassword } = require('../../helper/bcryptHelper')
const secret = process.env.JWT_SECRET

app.post('/auth/login', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  let user;

  db.get('users', { username })
    .then(userSearchResults => {
      if (userSearchResults.length) {
        user = userSearchResults[0]
        return checkPassword(password, user.password)
      } else {
        res.status(401).send('Unauthorized')
      }
    })
    .then(isPasswordMatch => {
      if (isPasswordMatch) {
        const token = jwt.sign(user, secret, {
          expiresIn: '6h'
        })
        user.token = token
        res.send(user)
      } else {
        res.status(401).send('Unauthorized')
      }
    })
    .catch((err) => {
      next(err)
    })
})

app.use(routeErrorHandler)

module.exports = app
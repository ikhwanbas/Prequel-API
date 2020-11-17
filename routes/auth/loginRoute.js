const express = require('express')
const app = express.Router()
const db = require('../../controller/dbController')
const jwt = require('jsonwebtoken')
const routeErrorHandler = require('../../middleware/errorHandler')
const { checkPassword } = require('../../helper/bcryptHelper')
const jwtConfig = require('../../configs/jwtConfig')

app.post('/auth/login', async (req, res, next) => {
  const body = req.body
  let { email, username, password } = body
  username = `/user/` + username
  // mengecek agar struktur request body harus sama dengan 2.
  if (Object.keys(body).length != 2) return res.status(400).send('body not allowed')

  // untuk mengecek key password sudah benar atau belum
  if (!body.password) return res.status(400).send('bad request, please write the right password key')

  let user
  if (body.hasOwnProperty("username")) {
    let userSearchResult = await db.get('users', { username })
      .catch(err => next(err))

    if (userSearchResult.length) {
      user = userSearchResult[0]
      let isPasswordMatch = await checkPassword(password, user.password)
        .catch(err => next(err))

      if (isPasswordMatch) {
        const token = jwt.sign({ id: user.id }, jwtConfig.secret, jwtConfig.options)
        user.token = token
        delete user.password
        res.send(user)
      } else {
        res.status(401).send('please input the right password')
      }
    }
    else {
      res.status(404).send('username is not found')
    }
  } else if (body.hasOwnProperty("email")) {
    let userSearchResult = await db.get('users', { email })
      .catch(err => next(err))

    if (userSearchResult.length) {
      user = userSearchResult[0]
      let isPasswordMatch = await checkPassword(password, user.password)
        .catch(err => next(err))

      if (isPasswordMatch) {
        const token = jwt.sign({ id: user.id }, jwtConfig.secret, jwtConfig.options)
        user.token = token
        delete user.password
        res.send(user)
      } else {
        res.status(401).send('Please input the right password')
      }
    } else {
      res.status(404).send('email is not found')
    }
  } else {
    res.status(400).send('bad request, please write the right key username or email')
  }
})

app.use(routeErrorHandler)

module.exports = app
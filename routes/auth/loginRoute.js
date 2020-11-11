const express = require('express')
const app = express.Router()
const db = require('../../controller/dbController')
const jwt = require('jsonwebtoken')
const routeErrorHandler = require('../../middleware/errorHandler')
const { checkPassword } = require('../../helper/bcryptHelper')
const secret = 'ini kode rahasia saya'

app.post('/auth/login', async (req, res, next) => {
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password
  let user
  if (!email) {
    let userSearchResult = await db.get('users', { username })
      .catch(err => next(err))
    if (userSearchResult) {
      user = userSearchResult[0]
      let isPasswordMatch = await checkPassword(password, user.password)
        .catch(err => next(err))
      if (isPasswordMatch) {
        const token = jwt.sign({ id: user.id }, secret, {
          expiresIn: '6h'
        })
        user.token = token
        res.header('authorization', user.token).send(user)
      } else {
        res.status(401).send('please input the right password')
      }
    }
    else {
      res.status(404).send('username is not found')
    }
  } else if (email) {
    let userSearchResult = await db.get('users', { email })
      .catch(err => next(err))
    if (userSearchResult) {
      user = userSearchResult[0]
      let isPasswordMatch = await checkPassword(password, user.password)
        .catch(err => next(err))
      if (isPasswordMatch) {
        const token = jwt.sign({ id: user.id }, secret, {
          expiresIn: '6h'
        })
        console.log();
        user.token = token
        res.header('authorization', user.token).send(user)
      } else {
        res.status(401).send('Please input the right password')
      }
    } else {
      res.status(404).send('email is not found')
    }
  }
})

app.use(routeErrorHandler)

module.exports = app
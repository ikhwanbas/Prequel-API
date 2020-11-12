const express = require('express');
const app = express.Router();
const db = require('../../controller/dbController');
const { salt } = require('../../helper/bcryptHelper');
const routeErrorHandler = require('../../middleware/errorHandler');
const dayjs = require('dayjs')
const regexHelper = require('../../helper/regexHelper')
const { validateDateFormat } = require('../../helper/dateHelper')


app.post('/auth/register', async (req, res, next) => {
  // Check credential's format:
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const anyWrongCredentialFormat = (
    !regexHelper.username.test(username) ||
    !regexHelper.email.test(email) ||
    !regexHelper.password.test(password)
  )
  if (anyWrongCredentialFormat) {
    return next(new Error('ERR_INVALID_FORMAT'))
  };

  // Check duplicate username or email:
  const isFoundDuplicateUsername = await db.get('users', { username: username })
  const isFoundDuplicateEmail = await db.get('users', { email: email })
  if (isFoundDuplicateUsername.length || isFoundDuplicateEmail.length) {
    return next(new Error('ERR_DUPLICATE_ENTRY'))
  }

  // Check birth date's format:
  if (!(await validateDateFormat(req.body.birthDate, 'YYYY-MM-DD'))) {
    return next(new Error('ERR_INVALID_FORMAT'))
  }

  // Check gender format:
  if (["male", "female"].every(gender => gender != req.body.gender)) {
    return next(new Error('ERR_INVALID_FORMAT'))
  }

  // Add user role:
  req.body.role = "user"
  if (req.body.username === "admin") {
    req.body.role = "admin"
  }

  // Password encryption:
  const hashedPassword = await salt(password)
  req.body.password = hashedPassword

  const result = await db.add('users', req.body)
  if (result) {
    return res.send(result)
  } else {
    next(new Error('ERR_BAD_FIELD_ERROR'))
  }
})


app.use(routeErrorHandler)

module.exports = app
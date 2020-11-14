const express = require('express');
const app = express.Router();
const db = require('../../controller/dbController');
const { salt } = require('../../helper/bcryptHelper');
const routeErrorHandler = require('../../middleware/errorHandler');
const regexHelper = require('../../helper/regexHelper')
const { validateDateFormat } = require('../../helper/dateHelper')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../../configs/jwtConfig')


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
    return res.status(406).send('Email already exist');
  }

  // Check birth date's format:
  if (!(await validateDateFormat(req.body.birthDate, 'YYYY-MM-DD'))) {
    return res.status(406).send('Invalid date format, should be "YYYY-MM-DD"');
  }

  // Check gender format:
  if (["male", "female"].every(gender => gender != req.body.gender)) {
    return res.status(406).send('Invalid gender format, should be "male" or "female"');
  }

  // Add user role:
  req.body.role = "user"
  if (req.body.username === "admin") {
    req.body.role = "admin"
  }

  // Password encryption:
  const hashedPassword = await salt(password)
  req.body.password = hashedPassword

  // Add the new user entry into the database:
  const result = await db.add('users', req.body)
  if (result) {
    // Tokenization:
    req.body.token = jwt.sign({ id: req.body.id }, jwtConfig.secret, jwtConfig.options)
    // Finally, send result:
    return res.send(result)
  } else {
    next(new Error('ERR_BAD_FIELD_ERROR'))
  }
})


app.use(routeErrorHandler)

module.exports = app
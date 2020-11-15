const express = require('express');
const app = express.Router();
const addUser = require('../../controller/addUserController');
const regexHelper = require('../../helper/regexHelper')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../../configs/jwtConfig')
const routeErrorHandler = require('../../middleware/errorHandler');
const { validateDateFormat } = require('../../helper/dateHelper')
const { salt } = require('../../helper/bcryptHelper');

app.post('/auth/register', async (req, res, next) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  // Check credential's format:
  if (
    !regexHelper.username.test(username) ||
    !regexHelper.email.test(email) ||
    !regexHelper.password.test(password)
  ) {
    return next(new Error('ERR_INVALID_FORMAT'))
  };

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
  const result = await addUser('users', req.body)
    .catch(err => next(err))
  req.body.token = jwt.sign({ id: req.body.id }, jwtConfig.secret, jwtConfig.options)

  // Finally, send result:
  return res.status(200).send(result)
})


app.use(routeErrorHandler)

module.exports = app
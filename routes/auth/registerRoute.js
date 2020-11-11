const express = require('express');
const app = express.Router();
const db = require('../../controller/dbController');
const { salt } = require('../../helper/bcryptHelper');
const routeErrorHandler = require('../../middleware/errorHandler');
const dayjs = require('dayjs')
const regexHelper = require('../../helper/regexHelper')
const {validateDateFormat} = require('../../helper/dateHelper')


app.post('/auth/register', (req, res, next) => {
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
    return next (new Error('ERR_INVALID_FORMAT'))
  };

  // Check birth date's format:
  if(!validateDateFormat(req.body.birthDate, 'YYYY-MM-DD')) {
    next (new Error('ERR_INVALID_FORMAT'))
  }

  salt(password)
    .then(hashedPassword => {
      req.body.password = hashedPassword
      return db.add('users', req.body)
      }
    )
    .then(addUserResult => {
      if (addUserResult) {
        return res.send(addUserResult)
      } else {
        next (new Error('ERR_BAD_FIELD_ERROR'))
      }
    })
    .catch(err => {
      next(err)
    })
})


app.use(routeErrorHandler)

module.exports = app
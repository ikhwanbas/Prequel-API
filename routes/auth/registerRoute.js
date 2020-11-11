const express = require('express');
const app = express.Router();
const db = require('../../controller/dbController');
const { salt } = require('../../helper/bcryptHelper');
const routeErrorHandler = require('../../middleware/errorHandler');
const usernameRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegex = /^[a-zA-Z0-9@#$%^&*]{8,50}$/;

app.post('/auth/register', (req, res, next) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  if(!usernameRegex.test(username) ||
  !emailRegex.test(email) ||
  !passwordRegex.test(password))
  next (new Error('ERR_INVALID_FORMAT'));

  salt(password)
    .then(hashedPassword => {
      req.body.password = hashedPassword
      return db.add('users', req.body)
      }
    )
    .then(addUserResult => {
      if (addUserResult) {
        res.send(addUserResult)
      } else {
        throw new Error('ERR_BAD_FIELD_ERROR')
      }
    })
    .catch(err => {
      next(err)
    })
})


app.use(routeErrorHandler)

module.exports = app
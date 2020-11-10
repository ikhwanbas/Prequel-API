const jwt = require('jsonwebtoken')
const secret = 'ini kode rahasia saya'
const passport = require('passport')
const { Strategy } = require('passport-http-bearer')

passport.use(new Strategy(
  (token, done) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (err.name === 'JsonWebTokenError' && err.name === 'TokenExpiredError')
          done(null, false)
        done(err)
      }
      done(null, decoded)
    })
  }))

module.exports = passport
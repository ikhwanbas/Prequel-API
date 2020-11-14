const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const passport = require('passport')
const { Strategy } = require('passport-http-bearer')


passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

// Http-bearer authentication to check if user has been login or not:
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
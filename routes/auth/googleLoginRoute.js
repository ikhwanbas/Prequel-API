const express = require('express');
const router = express.Router();
const passport = require('../../middleware/googleOauth')


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authorization, Google will redirect the user
//   back to this application at /auth/google/callback
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));


module.exports = router;

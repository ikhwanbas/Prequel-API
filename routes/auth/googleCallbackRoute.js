const express = require('express');
const router = express.Router();
const db = require('../../controller/dbController')
const errorHandler = require('../../middleware/errorHandler')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../../configs/jwtConfig')


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authorization, Google will redirect the user
//   back to this application at /auth/google/callback
router.get('/auth/google/callback', async (req, res, next) => {
    const { _json } = req.session.passport.user
    // try to find the user in the database:
    const foundUser = await db.get('user_socials', { sub: _json.sub })
    if (foundUser && foundUser.length) {
        // if user found, send user data & token:
        foundUser.token = jwt.sign(
            { id: req.body.id },
            jwtConfig.secret,
            jwtConfig.options
        )
        return res.send(foundUser)
    }


    // if user not found, create a new user:
    // prepare the body:
    const newUserBody = {
        firstName: _json.given_name,
        lastName: _json.family_name,
        email: _json.email,
        role: 'user',
    }

    // add new user data to the database:
    const newUserResult = await db.add('users', newUserBody)
        .catch(err => next(err))


    // if succeeded, send a new user-social data to the database:
    // prepare the data:
    _json.type = 'google'
    _json.userId = newUserResult.id
    delete _json.name

    // try to add the data into the database:
    const userSocialResult = await db.add(
        'user_socials', _json)
        .catch(err => next(err))

    // if succeeded, add a token:
    userSocialResult.token = jwt.sign(
        { id: req.body.id },
        jwtConfig.secret,
        jwtConfig.options
    )

    // send the result:
    return res.send(userSocialResult)
});

router.use(errorHandler)

module.exports = router;

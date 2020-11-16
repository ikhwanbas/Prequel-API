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
    const foundUserSocial = await db.get('user_socials', { sub: _json.sub })
        .catch(err => next(err))

    if (foundUserSocial.length) {
        // if user found, update google info:
        // prepare the data:
        const updateUserSocialData = {
            email_verified: _json.email_verified,
            locale: _json.locale
        }

        // try to add the data into the database:
        await db.edit(
            'user_socials',
            foundUserSocial[0].id,
            updateUserSocialData)
            .catch(err => next(err))

        // Finally, send user data & token:
        foundUserSocial.token = await jwt.sign(
            { id: foundUserSocial.id },
            jwtConfig.secret,
            jwtConfig.options
        )
        await () => {
            if (foundUserSocial.token) {
            return res.send(foundUserSocial)
        }
        else {
            return next(new Error(500))
    }


    // if user not found, create a new user:
    // prepare the body:
    const newUserBody = {
        firstName: _json.given_name,
        lastName: _json.family_name,
        email: _json.email,
        role: 'user',
    }
    // add a new user data to the database:
    const newUserResult = await db.add('users', newUserBody)
        .catch(err => next(err))


    // add a new profile image to the database:
    const newProfilePictureBody = {
        userId: newUserResult.id,
        imageUrl: _json.picture
    }
    const profileImageResult = await db.add('profile_images', newProfilePictureBody)
        .catch(err => next(err))


    // if succeeded, send a new user-social data to the database:
    // prepare the data:
    const newUserSocialData = {
        sub: _json.sub,
        email: _json.email,
        email_verified: _json.email_verified,
        locale: _json.locale,
        type: 'google',
        userId: newUserResult.id,
    }
    // try to add the data into the database:
    const userSocialResult = await db.add(
        'user_socials', newUserSocialData)
        .catch(err => next(err))


    // if succeeded, add a token:
    const token = jwt.sign(
        { id: newUserResult.id },
        jwtConfig.secret,
        jwtConfig.options
    )

    // send the result:
    return res.send([
        token,
        newUserResult,
        userSocialResult,
        profileImageResult])
});

router.use(errorHandler)

module.exports = router;

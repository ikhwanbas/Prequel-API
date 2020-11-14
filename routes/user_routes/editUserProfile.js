const express = require('express')
const router = express.Router()
const db = require('../../controller/dbController')
const routeErrorHandler = require('../../middleware/errorHandler')
const auth = require('../../middleware/auth')
const passport = require('passport')

// Browse users:
router.patch('/user/:username/edit',
    auth.authenticate('bearer', { session: true }),
    (req, res) => {
        console.log(req.session.passport.user)

        // Check if requested profile to edit is matched with username from token:
        if (req.params.username != '') {
            return res.status(401).send('Unauthorized');
        };

        // Search if the new username is existed in database:
        const isUsernameExist = getData('users', { username: req.body.username });
        if (isUsernameExist & isUsernameExist.length > 1) {
            return res.status(400).send('Username is existed');
        }

        // Search if the new email is existed in database:
        const isEmailExist = getData('users', { username: req.body.username });
        if (isEmailExist & isEmailExist.length > 1) {
            return res.status(400).send('Username is existed');
        }

        // if passed, the user can edit his/her data:
        req.body.id = req.user.id;
        const result = editData('users', req.body.id, req.body);

        if (!result) {
            // if false
            res.status(400).send('Bad request');
        } else {
            // if true
            res.send(result);
        }
        return;
    });

router.use(routeErrorHandler)

module.exports = router
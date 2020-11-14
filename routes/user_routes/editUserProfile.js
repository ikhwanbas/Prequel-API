const express = require('express')
const router = express.Router()
const db = require('../../controller/dbController')
const routeErrorHandler = require('../../middleware/errorHandler')
const auth = require('../../middleware/auth')
const regexHelper = require('../../helper/regexHelper')
const { validateDateFormat } = require('../../helper/dateHelper')
const { salt } = require('../../helper/bcryptHelper');

// Browse users:
router.patch('/user/:username/edit',
    auth.authenticate('bearer', { session: true }),
    async (req, res) => {

        const foundUser = await db.get('users', { id: req.session.passport.user.id })
        // console.log(foundUser[0]);
        // Check if requested profile to edit is matched with username from token:
        if (foundUser.length <= 0 || req.params.username != foundUser[0].username) {
            return res.status(401).send('Unauthorized');
        };

        let newData = {}
        // Search if the new username is existed in database:
        if (req.body.username.length > 0) {
            if (!(regexHelper.username.test(req.body.username))) {
                return res.status(406).send('Invalid username format');
            }
            const isUsernameExist = await db.get('users', { username: req.body.username });
            if (isUsernameExist & isUsernameExist.length > 1) {
                return res.status(400).send('Username already exists');
            }
            newData.username = req.body.username
        }


        // Search if the new email is existed in database:
        if (req.body.email.length > 0) {
            if (!(regexHelper.email.test(req.body.email))) {
                return res.status(406).send('Invalid email format');
            }
            const isEmailExist = await db.get('users', { email: req.body.email });
            if (isEmailExist & isEmailExist.length > 1) {
                return res.status(400).send('Email already exists');
            }
            newData.email = req.body.email
        }


        // Hash password if available:
        if (req.body.password.length > 0) {
            if (!(regexHelper.password.test(req.body.password))) {
                return res.status(406).send('Invalid password format');
            }
            const password = req.body.password
            const hashedPassword = await salt(password)
            newData.password = hashedPassword
        }

        // Check birth date's format if available:
        if (req.body.birthDate.length > 0) {
            if (!(await validateDateFormat(req.body.birthDate, 'YYYY-MM-DD'))) {
                return next(new Error('ERR_INVALID_FORMAT'))
            }
            newData.birthDate = req.body.birthDate
        }

        // Check gender format:
        if (req.body.gender.length > 0) {
            if (["male", "female"].every(gender => gender != req.body.gender)) {
                return next(new Error('ERR_INVALID_FORMAT'))
            }
            newData.gender = req.body.gender
        }
        // Check name format:
        if (req.body.firstName.length > 0) {
            if (!(regexHelper.letter.test(req.body.firstName))) {
                return res.status(406).send('Invalid first name format');
            }
            newData.firstName = req.body.firstName
        }
        if (req.body.lastName.length > 0 && regexHelper.letter.test(req.body.lastName)) {
            if (!(regexHelper.letter.test(req.body.lastName))) {
                return res.status(406).send('Invalid last name format');
            }
            newData.lastName = req.body.lastName
        }

        // if passed, the user can edit his/her data:
        const result = await db.edit('users', req.session.passport.user.id, newData);

        if (!result || result.length <= 0) {
            // if false
            res.status(400).send('Bad request');
        } else {
            // if true
            result.message = "User data was successfully updated"
            res.send(result);
        }
        return;
    });

router.use(routeErrorHandler)

module.exports = router
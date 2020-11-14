const express = require('express')
const app = express.Router()
const db = require('../../controller/dbController')
const routeErrorHandler = require('../../middleware/errorHandler')

// // Browse users:
// router.patch('/u/:username',
//     userPermission(['user', 'admin']), (req, res) => {
//         // Check param if found or not
//         const foundUser = getData('users', { id: req.user.id }[0]);
//         if (!foundUser || foundUser.length == 0) {
//             return res.status(400).send('Bad request');
//         }

//         // Check if requested profile to edit is matched with username from token:
//         if (req.params.username != foundUser) {
//             return res.status(401).send('Unauthorized');
//         };

//         // Search if username is existed in database:
//         const isUsernameExist = getData('users', { username: req.body.username });
//         if (isUsernameExist & isUsernameExist.length > 1) {
//             return res.status(400).send('Username is existed');
//         }

//         // if passed, users can edit their username:
//         req.body.id = req.user.id;
//         const result = editData('users', req.body.id, req.body);

//         if (!result) {
//             // if false
//             res.status(400).send('Bad request');
//         } else {
//             // if true
//             res.send(result);
//         }
//         return;
//     });

app.use(routeErrorHandler)

module.exports = app
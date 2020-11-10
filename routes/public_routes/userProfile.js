const express = require('express')
const app = express.Router()
const db = require('../../controller/dbController')
const routeErrorHandler = require('../../middleware/errorHandler')

// app.get('/user', (req, res, next) => {
//   db.get('users')
//     .then(userSearchResults => {
//       if (userSearchResults.length) {
//         user = userSearchResults[0]
//         res.send(user)
//       }
//     })
//     .catch((err) => {
//       next(err)
//     })
// })

app.get('/user/:id', (req, res, next) => {
  const id = '/user/' + req.params.id
  let user
  
  db.get('users', { id })
    .then(userSearchResults => {
      if (userSearchResults.length) {
        user = userSearchResults[0]
        res.send(user)
      }
    })
    .catch((err) => {
      next(err)
    })
})

app.use(routeErrorHandler)

module.exports = app
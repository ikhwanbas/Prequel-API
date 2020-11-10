const express = require('express')
const app = express.Router()
const db = require('../../controller/dbController')
const routeErrorHandler = require('../../middleware/errorHandler')

app.get('/user', (req, res, next) => {
  db.getAll('users')
    .then(userSearchResults => {
      if (userSearchResults.length) {
        if (!req.query.page || isNaN(req.query.page) || req.query.page == 0) {
        return res.status(422).send('Unprocessable Entity');
        }

        //  If results are found & the page is defined in the query, then continue:
        //  Calculate the pagination:
        const limit = 10;
        const startIndex = (req.query.page - 1) * limit;
        const endIndex = req.query.page * limit;
        
        //  Afther that, send the result:
        const page = userSearchResults.slice(startIndex, endIndex)
        if (!page || page.length <= 0) {
        return res.status(204).send('No content');   
        }
        return res.status(200).send(page);
      }
    })
    .catch((err) => {
      next(err)
    })
})

app.get('/user/:id', (req, res, next) => {
  const id = '/user/' + req.params.id
  let user
  
  db.get('users', { id })
    .then(userSearchResults => {
      if (userSearchResults && userSearchResults.length) {
        user = userSearchResults[0]
        res.send(user)
      } else throw 404; 
    })
    .catch((err) => {
      next(err)
    })
})

app.use(routeErrorHandler)

module.exports = app
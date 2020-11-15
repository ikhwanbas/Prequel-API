const express = require('express')
const app = express.Router()
const db = require('../../../controller/dbController')
const routeErrorHandler = require('../../../middleware/errorHandler')

app.get('/movie', (req, res, next) => {
  db.getAll('movies')
    .then(movieSearchResults => {
      if (movieSearchResults.length) {
        if (!req.query.page || isNaN(req.query.page) || req.query.page == 0) {
          return res.status(422).send('Unprocessable Entity');
        }

        const limit = 10;
        const startIndex = (req.query.page - 1) * limit;
        const endIndex = req.query.page * limit;

        const page = movieSearchResults.slice(startIndex, endIndex)
        if (!page || page.length <= 0) {
          return res.status(204).send('No content');
        }
        return res.status(200).send(page);
      }
      return res.status(404).send('Not Found')
    })
    .catch((err) => {
      next(err)
    })
})


app.use(routeErrorHandler)

module.exports = app
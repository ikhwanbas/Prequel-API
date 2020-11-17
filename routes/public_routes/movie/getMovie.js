const express = require('express')
const app = express.Router()
const db = require('../../../controller/movieController')
const routeErrorHandler = require('../../../middleware/errorHandler')

app.get('/movie', async (req, res) => {
    // apabila query page tidak ada, page = 1
    if (!req.query.page) {
        req.query.page = 1
    }
    // hitung start index dan end index:
    const limit = 10;
    const startIndex = (req.query.page - 1) * limit;
    const endIndex = req.query.page * limit;


    if (req.query.search) {
        // melakukan pengambilan data dari database apabila ada parameter search:
        const searchResult = await db.search('movies', 'movie_details', searchParameter, startIndex, endIndex)
            .catch(err => next(err))
        if (searchResult.length) {
            return res.status(200).send(searchResult)
        }
    }
    // apabila tidak ada search query, lakukan pengambilan movie page:
    const moviePageResult = await db.get('movies', 'movie_details', searchParameter)
        .catch(err => next(err))
    if (moviePageResult.length) {
        return res.status(200).send(moviePageResult)
    }
})

app.use(routeErrorHandler)

module.exports = app
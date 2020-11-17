const express = require('express')
const app = express.Router()
const db = require('../../../controller/dbController')
const routeErrorHandler = require('../../../middleware/errorHandler')

app.get('/movie/:id/review', async (req, res, next) => {
    const query = req.query
    const movieId = req.params.id

    // menjaga struktur query agar tidak lebih dari 2 input.
    if (Object.keys(query).length != 1 || Object.keys(req.params).length != 1) return res.status(400).send('query not allowed')

    // menjaga agar keyword query tidak berbeda
    if (!req.params.hasOwnProperty("id") || !query.hasOwnProperty("page")) {
        return res.status(400).send('query is not allowed')
    }

    // mengkondisikan agar page tidak kosong
    if (!req.params || req.params.id == 0) { return res.status(400).send('please insert movie ID') }

    // mengkondisikan agar page tidak kosong
    if (!query.page || isNaN(query.page) || query.page == 0) { return res.status(400).send('please insert page number') }

    // melakukan pengambilan data dari database
    const searchResult = await db.get('movie_reviews', { movieId: (`/movie/` + movieId) })
        .catch(err => next(err))

    // melakukan pagination/ pembatasan halaman agar 1 halaman tidak lebih dari 10
    if (searchResult.length) {
        const limit = 10;
        const startIndex = (req.query.page - 1) * limit;
        const endIndex = req.query.page * limit;
        const page = searchResult.slice(startIndex, endIndex)
        return res.status(200).send(page)
    } else {
        res.status(404).send('Error: data not found')
    }
})

app.use(routeErrorHandler)

module.exports = app
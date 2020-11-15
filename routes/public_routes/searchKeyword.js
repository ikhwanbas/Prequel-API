const express = require('express')
const app = express.Router()
const db = require('../../controller/movieController')
const routeErrorHandler = require('../../middleware/errorHandler')

app.get('/movies/', async (req, res) => {
    const query = req.query
    const searchParameter = query.search

    // menjaga struktur query agar tidak lebih dari 2 input.
    if (Object.keys(query).length != 2) return res.status(400).send('query not allowed')

    // menjaga agar keyword query tidak berbeda
    if (!query.hasOwnProperty("search") || !query.hasOwnProperty("page")) {
        return res.status(400).send('query is not allowed')
    }

    // mengkondisikan agar page tidak kosong
    if (!query.page || isNaN(query.page) || query.page == 0) { return res.status(400).send('please insert page number') }

    // melakukan pengambilan data dari database
    const searchResult = await db.get('movies', 'movie_details', searchParameter)
        .catch(err => next(err))

    // melakukan pagination/ pembatasan halaman agar 1 halaman tidak lebih dari 10
    if (searchResult.length) {
        const limit = 10;
        const startIndex = (req.query.page - 1) * limit;
        const endIndex = req.query.page * limit;
        const page = searchResult.slice(startIndex, endIndex)
        return res.status(200).send(page)
    } else {
        res.status(404).send('keyword is not found')
    }
})

app.use(routeErrorHandler)

module.exports = app
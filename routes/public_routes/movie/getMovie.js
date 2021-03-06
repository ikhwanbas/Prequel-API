const express = require('express')
const app = express.Router()
const dbMovie = require('../../../controller/movieController')
const routeErrorHandler = require('../../../middleware/errorHandler')


app.get('/movie', async (req, res, next) => {
    // apabila query limit tidak ada, limit = 8
    let limit = 8;
    if (req.query.limit) {
        limit = req.query.limit
    }

    // apabila query page tidak ada, startIndex = 0
    let startIndex = 0
    if (req.query.page) {
        startIndex = req.query.page * limit
    }

    // apabila searchParams tidak ada, searchParams = {}
    if (req.query.genre) {
        // apabila tidak ada search query, lakukan pengambilan movie page:
        const genreResult = await dbMovie.getMoviebyGenre(req.query.genre, startIndex, limit)
            .catch(err => next(err))
        if (genreResult.length) {
            return res.status(200).send(genreResult)
        }
        return res.status(404).json({
            code: 404,
            message: "Error: data not found"
        })
    }


    if (req.query.search) {
        // melakukan pengambilan data dari database apabila ada parameter search:
        const searchResult = await dbMovie.search(req.query.search, startIndex, limit
        ).catch(err => next(err))
        if (searchResult.length) {
            return res.status(200).send(searchResult)
        }
        return res.status(404).json({
            code: 404,
            message: "Error: data not found"
        })
    }


    // apabila tidak ada search query, lakukan pengambilan movie page:
    const moviePageResult = await dbMovie.getMovie(startIndex, limit)
        .catch(err => next(err))
    if (moviePageResult.length) {
        return res.status(200).send(moviePageResult)
    }
    return res.status(404).json({
        code: 404,
        message: "Error: data not found"
    })
})


app.use(routeErrorHandler)

module.exports = app
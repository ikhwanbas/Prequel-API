const express = require('express')
const app = express.Router()
const dbMovie = require('../../../controller/movieController')
const routeErrorHandler = require('../../../middleware/errorHandler')


app.get('/movie/:id', async (req, res, next) => {
    const movieId = '/movie/' + req.params.id

    const result = await dbMovie.getMovieById(movieId)
        .catch(err => next(err))
    // jika movie tidak ditemukan akan mereturn error 404
    if (!result || result.length == 0) {
        return res.status(404).send('movie is not found')
    }
    return res.status(200).send(result)

})

app.use(routeErrorHandler)

module.exports = app
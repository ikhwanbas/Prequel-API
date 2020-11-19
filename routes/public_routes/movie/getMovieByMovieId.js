const express = require('express')
const app = express.Router()
const db = require('../../../controller/dbController')
const routeErrorHandler = require('../../../middleware/errorHandler')


app.get('/movie/:id', async (req, res, next) => {
    const movieId = '/movie/' + req.params.id

    const result = await db.get('movies', { id: movieId })
    // jika movie tidak ditemukan akan mereturn error 404
    if (!result || result.length == 0) { res.status(404).send('movie is not found') }
    res.status(200).send(result)

})

app.use(routeErrorHandler)

module.exports = app
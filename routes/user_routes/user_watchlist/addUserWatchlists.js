const app = require('express')
const router = app.Router()
const errorHandler = require('../../../middleware/errorHandler')
const db = require('../../../controller/watchlistController')
const auth = require('../../../middleware/auth')
const shortid = require('shortid');

router.post('/movie/:id/watchlist',
    auth.authenticate('bearer', { session: true }),
    async (req, res, next) => {
        const userWatchlistId = `/watchlist/` + shortid()
        const movieId = `/movie/` + req.params.id
        const userId = req.session.passport.user.id

        // melakukan pengecekan movieID di table movie
        const searchMovie = await db.get('movies', 'id', movieId)
            .catch(err => next(err))
        if (!searchMovie || searchMovie == 0) {
            return res.status(404).send('Movie Id is Not Found')
        }

        // melakukan search user id dan movie id di user_watchlist
        const checkDataWatchlist = await db.getUserWatchList('user_watchlists', 'movie_id', movieId, 'user_id', userId)
            .catch(err => next(err))

        // menambahkan data watchlist oleh user di table user_watchlist jika belum ada datanya
        if (!checkDataWatchlist.length || checkDataWatchlist.length <= 0) {
            await db.add('user_watchlists', 'id', userWatchlistId, 'user_id', userId, 'movie_id', movieId)
                .catch(err => next(err))

        } else {
            // menghapus data watchlist oleh user di table user_watchlist
            await db.deletes('user_watchlists', 'user_id', userId, 'movie_id', movieId)
                .catch(err => next(err))
        }
        return res.status(200).send('okay, watchlist has been added / removed')
    })

router.use(errorHandler);

module.exports = router
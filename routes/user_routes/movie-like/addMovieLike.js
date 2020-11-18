const app = require('express')
const router = app.Router()
const errorHandler = require('../../../middleware/errorHandler')
const db = require('../../../controller/movieLikeController')
const auth = require('../../../middleware/auth')
const shortid = require('shortid');

router.post('/movie/:id/like',
    auth.authenticate('bearer', { session: true }),
    async (req, res, next) => {
        const movieLikesId = shortid()
        const movieId = `/movie/` + req.params.id
        const userId = req.session.passport.user.id

        // melakukan pengecekan movieID di table movie
        const searchMovie = await db.get('movies', 'id', 'title', movieId)
        if (!searchMovie || searchMovie == 0) {
            return res.status(404).send('Movie Id is Not Found')
        }

        // melakukan search user id dan movie id di movie_likes
        const checkDataLike = await db.getMovieLike('movie_likes', 'movie_id', movieId, 'user_id', userId)
            .catch(err => next(err))

        if (!checkDataLike.length || checkDataLike.length <= 0) {

            // menambahkan data likes oleh user di table movie_likes
            await db.add('movie_likes', 'id', movieLikesId, 'user_id', userId, 'movie_id', movieId)
                .catch(err => next(err))

            // menambahkan likes count (+1) di tabel movies 
            await db.editPlusOne('movies', 'like_count', movieId)
                .catch(err => next(err))
        } else {

            // mengurangi like_count (-1) di tabel movies
            await db.editMinusOne('movies', 'like_count', movieId)
                .catch(err => next(err))

            // menghapus data likes oleh user di table movie-likes
            await db.deletes('movie_likes', 'user_id', userId)
                .catch(err => next(err))
        }
        // untuk menampilkan movie_id dan like count sebagai response
        const result = await db.get('movies', 'id', 'like_count', movieId)
            .catch(err => next(err))
        res.status(200).send(result)
    })

router.use(errorHandler);

module.exports = router
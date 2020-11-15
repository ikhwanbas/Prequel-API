const app = require('express')
const router = app.Router()
const errorHandler = require('../../middleware/errorHandler')
const db = require('../../controller/dbController')
const auth = require('../../middleware/auth')

router.post('/movie/:id/review',
    auth.authenticate('bearer', { session: true }),
    async (req, res, next) => {
        const foundMovie = await db.get('movies',
            { id: `/movie/` + req.params.id })
            .catch(err => next(err))

        if (!foundMovie || foundMovie.length <= 0) {
            return res.status(404).send('Error: movie data not found')
        }

        // if rating is not between 0-10, send error:
        if (0 > req.body.rating > 10) {
            return res.status(406).send('Error: the rating value is not acceptable')
        }

        // set the movie ID & user ID inside body with the requested
        // path & user ID from token respectively:
        req.body.movieId = `/movie/` + req.params.id
        req.body.userId = req.session.passport.user.id

        // max one review per movie, if found duplicate, send error:
        const foundMovieReview = await db.get('movie_reviews', {
            movieId: req.body.movieId,
            userId: req.body.userId
        }).catch(err => next(err))

        if (foundMovieReview && foundMovieReview.length > 0) {
            return res.status(406).send('Error: user already submitted a review for this movie')
        }

        // if everything is ok, continue:

        const result = await db.add('movie_reviews', req.body)
            .catch(err => (err))
        return res.status(200).send(result)
    })

router.use(errorHandler);

module.exports = router
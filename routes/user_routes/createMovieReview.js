const app = require('express')
const router = app.Router()
const errorHandler = require('../../middleware/errorHandler')
const db = require('../../controller/dbController')
const auth = require('../../middleware')

router('/movie/:id/review',
    auth.authenticate('bearer', { session: true }),
    async (req, res, next) => {
        const foundMovie = await db.get('movies', { id: req.body.movieId })
            .catch(err => next(err))

        if (!foundMovie || foundMovie.length <= 0) {
            res.status(404).send('Error: movie data not found')
        }

        // if rating is not between 0-10, send error:
        if (0 > req.body.rating > 10) {
            res.status(406).send('Error: the rating value is not acceptable')
        }

        // set the movie ID & user ID inside body with the requested
        // path & user ID from token respectively:
        req.body.movieId = req.params.id
        req.body.userId = req.session.passport.user.id

        // max one review per movie, if found duplicate, send error:
        const foundMovieReview = db.get('movie_reviews', {
            movieId: req.body.movieId,
            userId: req.body.userId
        }).catch(err => next(err))

        if (foundMovieReview && foundMovieReview.length > 0) {
            res.status(406).send('Error: user already submitted a review for this movie')
        }

        // if everything is ok, continue:
        const result = await db.add('movie_reviews', req.body)
            .catch(err => (err))
        if (result & result.length > 0) {
            res.status(200).send(result)
        }
    })

router.use(errorHandler)

module.exports = router
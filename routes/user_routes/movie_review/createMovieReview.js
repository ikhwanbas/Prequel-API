const app = require('express')
const router = app.Router()
const errorHandler = require('../../../middleware/errorHandler')
const db = require('../../../controller/dbController')
const auth = require('../../../middleware/auth')
const _ = require('lodash')


router.post('/movie/:id/review',
    auth.authenticate('bearer', { session: true }),
    async (req, res, next) => {
        // get movie data:
        const foundMovie = await db.get('movies',
            { id: `/movie/` + req.params.id })
            .catch(err => next(err))

        if (!foundMovie || foundMovie.length <= 0) {
            // if movie was not found, send error:
            return res.status(404).send('Error: movie data not found')
        }

        // if rating is not between 0-10, send error:
        if (!req.body.rating ||
            0 > req.body.rating > 10) {
            return res.status(400).send('Error: the rating value is invalid')
        }

        // set the movie ID & user ID inside body with the requested
        // path & user ID from token respectively:
        req.body.movieId = `/movie/` + req.params.id
        req.body.userId = req.session.passport.user.id

        // max one review per movie
        const foundMovieReview = await db.get('movie_reviews', {
            movieId: req.body.movieId,
            userId: req.body.userId
        }).catch(err => next(err))

        if (foundMovieReview && foundMovieReview.length > 0) {
            // if found duplicates, send error:
            return res.status(406).send('Error: the user already submitted a review for this movie')
        }

        // if everything is ok, continue:

        const result = await db.add('movie_reviews', req.body)
            .catch(err => (err))
        if (result) {
            // if successfully edited, re-calculate the movie's rating:
            // get all rating numbers of the movie:
            let newMovieAverageRating = await db.get(
                'movie_reviews',
                { movieId: foundMovieReview.movieId },
                'movie_reviews.rating'
            ).catch(err => console.log(err))
            newMovieAverageRating = await _.meanBy(newMovieAverageRating, (obj) => obj.rating)


            if (newMovieAverageRating) {
                // if ok, continue to send the updated data:
                updatedAverageReview = await db.edit(
                    'movies',
                    foundMovieReview.movieId,
                    { averageReview: newMovieAverageRating }
                ).catch(err => console.log(err))

                // if ok, continue to send the updated data:
                result.message = `The movie review and movie's average-rating was successfully updated.`
                result.result = updatedAverageReview
                result.result.movieId = foundMovieReview.movieId

                return res.status(200).send(result)
            }
            // if failed to calculate the updated data, send failure message:
            result.message = `The movie review  was successsfully updated,
            but the movie average-rating was failed to be updated.`

            return res.status(200).send(result)
        }
    })

router.use(errorHandler);

module.exports = router
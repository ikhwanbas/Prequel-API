const app = require('express')
const router = app.Router()
const errorHandler = require('../../../middleware/errorHandler')
const db = require('../../../controller/dbController')
const auth = require('../../../middleware/auth')
const _ = require('lodash')


router.patch('/movie-review/:id',
    auth.authenticate('bearer', { session: true }),
    async (req, res, next) => {
        // check if the movie_review.userId is the same with user ID from token:
        let foundMovieReview = await db.get('movie_reviews', {
            id: `/movie-review/` + req.params.id,
            userId: req.session.passport.user.id
        })
        foundMovieReview = foundMovieReview[0]

        if (!foundMovieReview || foundMovieReview.length <= 0) {
            // if not found:
            res.status(403).send('Error: forbidden')
        }

        // prepare a storage for the new movie review data:
        let newMovieReviewData = {}

        // if rating is not between 0-10, send error:
        if (typeof req.body.rating === 'number') {
            if (0 > req.body.rating > 10) {
                return res.status(400).send('Error: the rating value is invalid')
            }
            // put rating in newMovieReviewData:
            newMovieReviewData.rating = req.body.rating
        }

        // if message is available, put message into newMovieReviewData:
        if (req.body.comment && req.body.comment.length > 0) {
            newMovieReviewData.comment = req.body.comment
        }

        // if everything is ok, continue to edit:
        const result = await db.edit('movie_reviews',
            (`/movie-review/` + req.params.id), newMovieReviewData)
            .catch(err => next(err))


        if (result) {
            // if successfully edited, re-calculate the movie's rating:
            // get all rating numbers of the movie:
            let newMovieAverageRating = await db.get(
                'movie_reviews',
                { movieId: foundMovieReview.movieId },
                'movie_reviews.rating'
            ).catch(err => console.log(err))
            newMovieAverageRating = _.meanBy(newMovieAverageRating, (obj) => obj.rating)

            if (newMovieAverageRating) {
                // if ok, continue to send the updated data:
                updatedAverageRating = await db.edit(
                    'movies',
                    foundMovieReview.movieId,
                    { averageRating: newMovieAverageRating }
                ).catch(err => console.log(err))

                // if ok, continue to send the updated data:
                result.message = `The movie review and movie's average-rating was successfully updated.`
                result.result = updatedAverageRating
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
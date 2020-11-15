const app = require('express')
const router = app.Router()
const auth = require('../../../middleware/auth')
const db = require('../../../controller/dbController')


router.delete('/movie-review/:id',
    auth.authenticate('bearer', { session: true }),
    async (req, res, next) => {
        // check if the movie_review.userId is the same with user ID from token:
        const foundMovieReview = db.get('movie_reviews', {
            id: req.params.id,
            userId: req.session.passport.user.id
        })
        if (!foundMovieReview || foundMovieReview.length <= 0) {
            res.status(403).send('Error: forbidden')
        }

        // if ok, send result:
        const result = await db.remove(
            'movie_reviews',
            (`/movie-review/` + req.params.id)
        ).catch(err => next(err))

        if (result) {
            res.status(200).send('The data was successfully deleted')
        }
        res.status(404).send('Error: not found')
    })


module.exports = router
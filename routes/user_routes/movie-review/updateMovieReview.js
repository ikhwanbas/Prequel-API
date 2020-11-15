const app = require('express')
const router = app.Router()
const errorHandler = require('../../../middleware/errorHandler')
const db = require('../../../controller/dbController')
const auth = require('../../../middleware/auth')

router.patch('/movie-review/:id',
    auth.authenticate('bearer', { session: true }),
    async (req, res, next) => {

        let newData = {}
        // if rating is not between 0-10, send error:
        if (typeof req.body.rating == 'number') {
            if (0 > req.body.rating > 10) {
                return res.status(400).send('Error: the rating value is invalid')
                // put rating in newData:

            }
            newData.rating = req.body.rating
        }

        // if message is available, put message into newData:
        if (req.body.comment && req.body.comment.length > 0) {
            newData.comment = req.body.comment
        }

        // if everything is ok, continue:
        const result = await db.edit('movie_reviews', (`/movie-review/` + req.params.id), newData)
            .catch(err => (err))
        return res.status(200).send(result)
    })

router.use(errorHandler);

module.exports = router
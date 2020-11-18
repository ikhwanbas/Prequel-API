const app = require('express')
const router = app.Router()
const errorHandler = require('../../../middleware/errorHandler')
const db = require('../../../controller/watchlistController')
const auth = require('../../../middleware/auth')

router.get('/watchlist',
    auth.authenticate('bearer', { session: true }),
    async (req, res, next) => {
        const userId = req.session.passport.user.id
        const page = req.query.page
        const endIndex = 8
        // jika page tidak diisi maka akan secara default masuk ke page 1
        if (page == undefined) {
            let startIndex = 0
            // mengambil data dari database.
            const result = await db.getResult('movies', 'user_watchlists', userId, startIndex, endIndex)
                .catch(err => next(err))
            if (result.length == 0) {
                res.status(404).send('watchlist is not found')
            } else {
                res.status(200).send(result)
            }

        } else if (page) {
            // jika ada query page namun bukan number maka akan mereturn 406 Not Acceptable 
            if (isNaN(page) || page == 0) {
                return res.status(406).send('page value is not allowed')
            } else {
                // mengatur limitation page agar start index = 0
                let startIndex = (page - 1) * 8
                // melakukan pengambilan data dari database
                // dengan menampilkan watchlist dari user sebagai response
                const result = await db.getResult('movies', 'user_watchlists', userId, startIndex, endIndex)
                    .catch(err => next(err))

                // jika data tidak ditemukan maka akan mereturn 404 Not Found
                if (result.length == 0) {
                    res.status(404).send('watchlist is not found')
                } else {
                    return res.status(200).send(result)
                }
            }
        } else {
            //jika ada query page namun tidak diisi valuenya mereturn 406 Not Acceptable
            return res.status(406).send('page value is not allowed')
        }
    })

router.use(errorHandler);

module.exports = router
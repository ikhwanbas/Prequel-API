const dayjs = require('dayjs')
const app = require('express')
const router = app.Router()
const db = require('../../controller/dbController')
const routeErrorHandler = require('../../middleware/errorHandler')


router.post('/admin/:tableName/', async (req, res, next) => {
    // Check request:
    const tableName = req.params.tableName
    if (tableName.length <= 0 ||
        req.body <= 0) {
        return res.status(400).send('Bad request')
    }

    // fix date if needed:
    // req.body.releaseDate = dayjs(req.body.releaseDate).format('YYYY-MM-DD')

    // Try adding the data into the database
    try {
        const result = await db.add(tableName, req.body)
        if (result.length > 0) {
            return res.status(200).send(result)
        }
    } catch (err) {
        console.log(err);
        return next(new Error(err))
    }

})


router.use(routeErrorHandler)

module.exports = router
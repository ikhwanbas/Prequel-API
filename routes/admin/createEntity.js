const app = require('express')
const shortid = require('shortid')
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

    // set id value with shortid:
    req.body.id = `/${tableName}/` + shortid()
    // Try adding the data into the database
    try {
        const result = await db.add(tableName, req.body)
        return res.status(200).send(result)
    } catch (err) {
        console.log(err);
        return next(new Error(err))
    }

})


router.use(routeErrorHandler)

module.exports = router
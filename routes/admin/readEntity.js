const dayjs = require('dayjs')
const app = require('express')
const router = app.Router()
const db = require('../../controller/dbController')
const routeErrorHandler = require('../../middleware/errorHandler')
const pluralize = require('pluralize')


router.get('/admin/:tableName', async (req, res, next) => {
    // Check request:
    const tableName = pluralize.plural(req.params.tableName)
    if (tableName.length <= 0) {
        return res.status(400).send('Bad request')
    }

    let page = 0
    if (req.query.page) {
        page = req.query.page
    }

    let limit = 8
    if (req.query.limit) {
        limit = req.query.limit
    }

    // Try adding the data into the database
    try {
        const result = await db.getPage(tableName, {}, '*', page, limit)
        return res.status(200).send(result)
    } catch (err) {
        console.log(err);
        return next(new Error(err))
    }

})

router.get('/admin/:tableName/:id', async (req, res, next) => {
    // Check request:
    const tableName = pluralize.plural(req.params.tableName)
    if (tableName.length <= 0 ||
        req.body <= 0) {
        return res.status(400).send('Bad request')
    }

    // Try adding the data into the database
    const fullId = `/${req.params.tableName}/` + req.params.id
    try {
        const result = await db.get(tableName,
            { id: fullId })
        return res.status(200).send(result)
    } catch (err) {
        console.log(err);
        return next(new Error(err))
    }

})


router.use(routeErrorHandler)

module.exports = router
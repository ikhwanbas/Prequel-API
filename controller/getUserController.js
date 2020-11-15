// const { v4: uuidv4 } = require('uuid');
const shortid = require('shortid');
const db = require('../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')
const pluralize = require('pluralize')
const { createInsertColumns } = require('./dbController')


function get(leftTable, rightTable, outputs, searchParameters) {
    let query = `SELECT ${outputs} FROM ${leftTable}`

    query += ` LEFT JOIN ${rightTable} ON ${leftTable}.id = ${rightTable}.user_id`
    const searchParameterKeys = Object.keys(searchParameters)
    if (searchParameterKeys.length) {
        query += ` WHERE ${leftTable}.username = "/user/${Object.values(searchParameters)}"
        OR ${leftTable}.id = "/user/${Object.values(searchParameters)}"`
    }

    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err)
                reject(err)
            else
                resolve(result.map(res => {
                    const plainObject = _.toPlainObject(res)
                    const camelCaseObject = humps.camelizeKeys(plainObject)
                    return camelCaseObject
                }))
        })
    })
}

function pagination(leftTable, rightTable, outputs, startIndex, endIndex) {
    let query = `SELECT ${outputs} FROM ${leftTable}`

    query += ` LEFT JOIN ${rightTable} ON ${leftTable}.id = ${rightTable}.user_id`

    query += ` LIMIT ${startIndex}, ${endIndex}`

    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err)
                reject(err)
            else
                resolve(result.map(res => {
                    const plainObject = _.toPlainObject(res)
                    const camelCaseObject = humps.camelizeKeys(plainObject)
                    return camelCaseObject
                }))
        })
    })
}


module.exports = {
    get,
    pagination
}
// const { v4: uuidv4 } = require('uuid');
const shortid = require('shortid');
const db = require('../connection/dbConnection')
const _ = require('lodash')
const pluralize = require('pluralize')
const { createInsertColumns } = require('./dbController')

function addUser(tableName, body) {
    body.id = `/${pluralize.singular(tableName)}/` + shortid()
    body.username = `/${pluralize.singular(tableName)}/` + body.username
    const columnValue = createInsertColumns(body)

    let query = `INSERT INTO ${tableName} (${columnValue.columns})
  VALUES (${columnValue.values})`

    return new Promise((resolve, reject) => {
        db.query(query, (err) => {
            if (err)
                reject(err)
            else
                resolve(body)
        })
    })
}


module.exports = addUser
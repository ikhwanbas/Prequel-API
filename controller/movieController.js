const db = require('../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')


function getMovie (tableName) {
    let query = `SELECT movies.*, 
    GROUP_CONCAT(movie_details.type, movie_details.text separator '|') as details
    FROM ${tableName}
    LEFT JOIN movie_details
    ON movies.id = movie_details.movie_id
    GROUP BY movies.id;`


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

  module.exports = {getMovie}
  
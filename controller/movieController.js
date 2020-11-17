const db = require('../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')

function search(tableName, tableName2, searchParameter, startIndex, endIndex) {
  let query = `SELECT 
${tableName}.id,
${tableName}.title, 
${tableName}.release_date, 
${tableName}.synopsis, 
${tableName}.trailer_url,
${tableName}.average_rating,
${tableName}.created_at,
${tableName}.updated_at,
${tableName}.info,
GROUP_CONCAT(${tableName2}.text SEPARATOR '|') as details
FROM ${tableName}
LEFT JOIN ${tableName2}
ON ${tableName}.id = ${tableName2}.movie_id
GROUP BY ${tableName}.id
HAVING title LIKE '%${searchParameter}%' 
OR synopsis LIKE '%${searchParameter}%' 
OR info LIKE '%${searchParameter}%' 
OR details LIKE '%${searchParameter}%'
LIMIT ${startIndex}, ${endIndex}
`

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


function getMovie(tableName, startIndex, endIndex) {
  let query = `SELECT movies.*, 
    GROUP_CONCAT(movie_details.type, movie_details.text separator '|') as details
    FROM ${tableName}
    LEFT JOIN movie_details
    ON movies.id = movie_details.movie_id
    GROUP BY movies.id
    LIMIT ${startIndex}, ${endIndex}`


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
  search,
  getMovie
}
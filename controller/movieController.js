const db = require('../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')

function get(tableName, tableName2, searchParameter) {
  let query = `SELECT 
${tableName}.id,
${tableName}.title, 
${tableName}.release_date, 
${tableName}.synopsis, 
${tableName}.trailer_url,
${tableName}.average_review,
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

module.exports = {
  get
}
const db = require('../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')


function chainLike(object) {
  const parsedObject = humps.decamelizeKeys(object)
  const parsedObjectKeys = Object.keys(parsedObject)
  return parsedObjectKeys.map((objKey, index) => {
    let value = parsedObject[objKey]
    if (typeof value === 'string') {
      value = `"%${value}%"`
    }
    let composedString = `${objKey} LIKE ${value}`
    if (index + 1 != parsedObjectKeys.length)
      composedString += ' AND'
    return composedString
  }).join(' ')
}

function getMovie(
  searchParams = {},
  startIndex = (0),
  limit = (8)
) {
  let query = `
SELECT m.id,
m.title,

GROUP_CONCAT(
CASE WHEN mi.type = '/poster'
THEN mi.image_url ELSE NULL END SEPARATOR ', '
) as poster_url,

GROUP_CONCAT(
CASE WHEN mi.type != '/poster'
THEN mi.image_url ELSE NULL END SEPARATOR ', '
) as image_urls,

m.release_date,
m.synopsis,
m.info,
m.trailer_url,
COUNT(ml.id) as like_count,
AVG(mr.rating) as average_rating,
COUNT(mr.id) as review_count,

GROUP_CONCAT(
CASE WHEN md.type = '/genre'
THEN md.text ELSE NULL END SEPARATOR ', '
) as genres,

GROUP_CONCAT(
CASE WHEN md.type = '/star'
THEN md.text ELSE NULL END SEPARATOR ', '
) as stars,

GROUP_CONCAT(
CASE WHEN md.type = '/production'
THEN md.text ELSE NULL END SEPARATOR ', '
) as productions,

GROUP_CONCAT(
CASE WHEN md.type = '/director'
THEN md.text ELSE NULL END SEPARATOR ', '
) as directors

FROM movies m

LEFT JOIN movie_details md
ON m.id = md.movie_id

LEFT JOIN movie_images mi
ON m.id = mi.movie_id

LEFT JOIN movie_reviews mr
ON m.id = mr.movie_id

LEFT JOIN movie_likes ml
ON m.id = ml.movie_id

GROUP BY m.id`

  const searchParamsKeys = Object.keys(searchParams)
  if (searchParamsKeys.length) {
    query += " HAVING " + chainLike(searchParams)
  }

  query += ` LIMIT ${startIndex}, ${limit}`

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
  getMovie
}
// const { v4: uuidv4 } = require('uuid');
const shortid = require('shortid');
const db = require('../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')
const pluralize = require('pluralize')

function chainWhere(object) {
  const parsedObject = humps.decamelizeKeys(object)
  const parsedObjectKeys = Object.keys(parsedObject)
  return parsedObjectKeys.map((objKey, index) => {
    let value = parsedObject[objKey]
    if (typeof value === 'string') {
      value = `"${value}"`
    }
    let composedString = `${objKey} = ${value}`
    if (index + 1 != parsedObjectKeys.length)
      composedString += ' AND'
    return composedString
  }).join(' ')
}

function chainSet(object) {
  const parsedObject = humps.decamelizeKeys(object)
  const parsedObjectKeys = Object.keys(parsedObject)
  return parsedObjectKeys.map((objKey, index) => {
    let value = parsedObject[objKey]
    if (typeof value === 'string') {
      value = `"${value}"`
    }
    let composedString = `${objKey} = ${value}`
    return composedString
  }).join(', ')
}

function createInsertColumns(object) {
  const parsedObject = humps.decamelizeKeys(object)
  return {
    columns: Object.keys(parsedObject).join(','),
    values: Object.values(parsedObject).map(value =>
      typeof value === 'string' ? `"${value}"` : value).join(',')
  }
}

function get(tableName, searchParameters) {
  let query = `SELECT * FROM ${tableName}`
  
  const searchParameterKeys = Object.keys(searchParameters)
    if (searchParameterKeys.length) {
      query += " WHERE " + chainWhere(searchParameters)
    }

  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err)
        reject(new Error('fail'))
      else
        resolve(result.map(res => {
          const plainObject = _.toPlainObject(res)
          const camelCaseObject = humps.camelizeKeys(plainObject)
          return camelCaseObject
        }))
    })
  })
}

// function getAll(tableName, searchParameters) {
//   let query = `SELECT * FROM ${tableName}`
// }

function add(tableName, body) {
  const id = `/${pluralize.singular(tableName)}/` + shortid()
  body.id = id
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

function edit(tableName, id, body) {
  let query = `UPDATE ${tableName}
  SET ${chainSet(body)}
  WHERE id="${id}"`
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err)
        reject(err)
      else if (!result.affectedRows)
        reject({
          code: "ERR_NOT_FOUND"
        })
      else
        resolve(body)
    })
  })
}


function remove(tableName, id) {
  let query = `DELETE FROM ${tableName}
  WHERE id="${id}"`
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err)
        reject(err)
      else if (!result.affectedRows)
        reject({
          code: "ERR_NOT_FOUND"
        })
      else
        resolve(id)
    })
  })
}


module.exports = {
  get,
  add,
  edit,
  remove
}
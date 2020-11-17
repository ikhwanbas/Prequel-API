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

function get(tableName, searchParameters, output = '*') {
  tableName = humps.decamelize(tableName).replace('-', '_')

  let query = `SELECT ${output} FROM ${tableName}`

  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += " WHERE " + chainWhere(searchParameters)
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


function getPage(tableName, searchParameters, output = '*', startIndex, endIndex) {
  tableName = humps.decamelize(tableName).replace('-', '_')

  let query = `SELECT ${output} FROM ${tableName}`

  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += " WHERE " + chainWhere(searchParameters)

    query += ` LIMIT startIndex, endIndex`
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


function getAll(tableName, output = '*') {
  tableName = humps.decamelize(tableName).replace('-', '_')

  let query = `SELECT ${output} FROM ${tableName}`

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

function add(tableName, body) {
  tableName = humps.decamelizeKeys(tableName)
  let parsedTableName = tableName.replace('_', '-')
  body.id = `/${pluralize.singular(parsedTableName)}/` + shortid()
  const columnValue = createInsertColumns(body)

  let query = `INSERT INTO ${tableName} (${columnValue.columns})
  VALUES (${columnValue.values})`

  return new Promise((resolve, reject) => {
    db.query(query, (err) => {
      if (err)
        return reject(err)
      else
        return resolve(body)
    })
  })
}

function edit(tableName, id, body) {
  tableName = humps.decamelize(tableName).replace('-', '_')

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
  chainWhere,
  chainSet,
  createInsertColumns,
  get,
  add,
  edit,
  remove,
  getAll,
  getPage
}
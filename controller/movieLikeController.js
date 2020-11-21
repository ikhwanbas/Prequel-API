// const { v4: uuidv4 } = require('uuid');
const db = require('../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')

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

// fungsi untuk menampilkan 2 kolom dari sebuah tabel dengan 1 kondisi
function get(tableName, columnName1, columnName2, value1) {
  let query = `SELECT  ${columnName1}, ${columnName2} 
  FROM ${tableName}
  WHERE ${columnName1} = "${value1}" `
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

// fungsi untuk mengambil data sebuah tabel dari database dengan 2 kondisi  
function getMovieLike(tableName, columnName1, value1, columnName2, value2) {
  let query = `SELECT * FROM ${tableName} WHERE ${columnName1} = "${value1}" AND ${columnName2} = "${value2}"`
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

// fungsi untuk menambah nilai query (+1)
function editPlusOne(tableName, columnName, id) {
  let query = `UPDATE ${tableName}
  SET ${columnName} = ${columnName} + 1
  WHERE id="${id}"`
  return new Promise((resolve, reject) => {
    db.query(query, (err) => {
      if (err)
        reject(err)
      else
        resolve()
    })
  })
}

// fungsi untuk mengurangi nilai query (-1) 
function editMinusOne(tableName, columnName, id) {
  let query = `UPDATE ${tableName}
  SET ${columnName} = ${columnName} - 1
  WHERE id="${id}"`
  return new Promise((resolve, reject) => {
    db.query(query, (err) => {
      if (err)
        reject(err)
      else
        resolve()
    })
  })
}

// fungsi untuk melakukan delete dari sebuah tabel dengan kondisi columnName1 = id
function deletes(tableName, columnName1, id) {
  let query = `DELETE from ${tableName}
  WHERE ${columnName1}="${id}"`
  return new Promise((resolve, reject) => {
    db.query(query, (err) => {
      if (err)
        reject(err)
      else
        resolve()
    })
  })
}

// fungsi untuk melakukan insert data ke database dengan 3 kolom dalam satu tabel
function add(tableName, columnName1, value1, columnName2, value2, columnName3, value3) {
  let query = `INSERT INTO ${tableName} (${columnName1}, ${columnName2}, ${columnName3} )
  VALUES ("${value1}", "${value2}", "${value3}")`
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err)
        reject(err)
      else
        resolve(result)
    })
  })
}
module.exports = {
  chainWhere,
  chainSet,
  createInsertColumns,
  getMovieLike,
  add,
  get,
  editPlusOne,
  editMinusOne,
  deletes
}
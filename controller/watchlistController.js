// const { v4: uuidv4 } = require('uuid');
const db = require('../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')

// fungsi untuk menampilkan 2 kolom dari sebuah tabel dengan 1 kondisi
function get(tableName, columnName1, value1) {
  let query = `SELECT  ${columnName1}
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
function getUserWatchList(tableName, columnName1, value1, columnName2, value2) {
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

// fungsi untuk melakukan delete dari sebuah tabel dengan kondisi columnName1 = id
function deletes(tableName, columnName1, id, columnName2, value2) {
  let query = `DELETE from ${tableName}
  WHERE ${columnName1}="${id}" AND ${columnName2} = "${value2}" `
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

function getResult(tableName1, tableName2, userId, startIndex, endIndex) {
  let query = `SELECT *
  FROM ${tableName1}
  JOIN ${tableName2}
  ON ${tableName1}.id = ${tableName2}.movie_id 
  WHERE ${tableName2}.user_id = '${userId}'
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
  getResult,
  getUserWatchList,
  add,
  get,
  deletes
}
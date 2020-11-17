const express = require('express')
const app = express.Router()
const db = require('../controller/dbController')

app.get('/', (req, res) => {
  res.send(`<title>Welcome!</title>
  <h1>Welcome to Prequel's API!</h1>
  API Documentation: <a href="https://documenter.getpostman.com/view/13001756/TVem9oxi">(link)</a>`)
})

module.exports = app
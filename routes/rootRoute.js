const express = require('express')
const app = express.Router()
const db = require('../controller/dbController')

app.get('/', async (req, res) => {
  const result = await db.getJoin('movies', 'movie_images', '*', 'movie_id')
  res.render('index', { images: result })
})
module.exports = app
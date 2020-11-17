const express = require('express')
const app = express.Router()
const getUser = require('../../../controller/getUserController')
const routeErrorHandler = require('../../../middleware/errorHandler')
const auth = require('../../../middleware/auth')

// Get users by page query:
app.get('/user', async (req, res, next) => {
  //  Calculate the pagination:
  // hitung start index dan end index:
  let limit = 8;
  if (req.query.limit && req.query.limit > 0) {
    limit = req.query.limit
  }
  const startIndex = (req.query.page - 1) * limit;
  const endIndex = req.query.page * limit;


  if (isNaN(req.query.page) || req.query.page <= 0) {
    res.status(406).send('Error: Request not acceptable')
  }

  const result = await getUser
    .pagination(
      `users`,
      `profile_images`,

      `users.id,
      users.first_name,
      users.last_name,
      users.username,
      profile_images.image_url as profile_image_url`,

      startIndex,
      endIndex
    )
    .catch(err => next(err))
  if (!result || result.length <= 0) {
    return res.status(404).send('Error: not found');
  }
  return res.status(200).send(result);

})

// Get a specific user:
app.get('/user/:credential',
  async (req, res, next) => {
    const credential = req.params.credential

    const result = await getUser
      .get(
        `users`,
        `profile_images`,

        `users.*,
      profile_images.image_url as profile_image_url`,

        { credential }
      )
      .catch(err => next(err))
    if (result && result.length > 0) {
      return res.status(200).send(result[0])
    }
    else {
      res.status(404).send('Error: not found')
    }
  })

app.use(routeErrorHandler)

module.exports = app
const express = require('express')
const app = express.Router()
const getUser = require('../../controller/getUserController')
const routeErrorHandler = require('../../middleware/errorHandler')
const auth = require('../../middleware/auth')

// Browse users:
app.get('/user', async (req, res, next) => {
  //  Calculate the pagination:
  const limit = 10;
  const startIndex = (req.query.page - 1) * limit;
  const endIndex = req.query.page * limit;

  const result = await getUser.pagination(
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
  if (!result || result.length <= 0) {
    return res.status(204).send('No content');
  }
  return res.status(200).send(result);

})

// Find a user by user's username and it's reviews
app.get('/user/:credential',
  async (req, res, next) => {
    const credential = req.params.credential

    const foundByUsername = await getUser.get(
      `users`,
      `profile_images`,

      `users.id,
      users.first_name,
      users.last_name,
      users.username,
      profile_images.image_url as profile_image_url`,

      { credential }
    )

    return res.status(200).send(foundByUsername[0])
  })

app.use(routeErrorHandler)

module.exports = app
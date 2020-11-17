require('dotenv').config()
const express = require('express')
const passport = require('passport');
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieSession({
  name: 'user-session',
  keys: ['key1, key2']
}))
app.set('view engine', 'html');

// run all routes in routes folder:
const readDir = require('read-dir-deep');
const path = require('path')
const routesPath = path.resolve('routes')
const filePaths = readDir.readDirDeepSync(routesPath)
filePaths.forEach((filePath) => {
  const relativeFilePath = `./${filePath}`
  console.log(`${relativeFilePath} loaded!`);
  const route = require(relativeFilePath)
  app.use(route)
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Backend app is running in http://localhost:${port}`);
})

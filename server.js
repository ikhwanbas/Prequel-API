require('dotenv').config()
const express = require('express')
const passport = require('passport');
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

app.set('view engine', 'ejs')
app.use(express.static("views"));
app.use(express.static("img"));
app.use(express.static("js"));
app.use(express.static("css"));

app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieSession({
  name: 'user-session',
  keys: ['key1, key2']
}))


const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (["http://localhost"].indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}
app.use(cors(corsOptionsDelegate))


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

const mysql = require('mysql')

// const db = mysql.createConnection({
//   database: process.env.MYSQL_DATABASE,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   host: process.env.MYSQL_HOST,
// })

const db = mysql.createConnection({
  database: 'prequel_api',
  user: 'root',
  password: '',
  host: 'localhost',
})

db.query('SELECT "Database connected!" message', (err, result) => {
  if (err)
    console.log(err);
  else
    console.log(result[0].message);
})

module.exports = db
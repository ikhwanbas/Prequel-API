const mysql = require('mysql')

const db = mysql.createConnection({
  database: 'prequel_api',
  user: 'root',
  password: '19940426',
  host: 'localhost',
})

db.query('SELECT "Database connected!" message', (err, result) => {
  if (err)
    console.log(err);
  else
    console.log(result[0].message);
})

module.exports = db
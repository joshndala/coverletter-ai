const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,        // Your AWS RDS endpoint
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false       // Required for AWS RDS
  }
})

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client:', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query:', err.stack)
    }
    console.log('Connected to Database!')
  })
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}
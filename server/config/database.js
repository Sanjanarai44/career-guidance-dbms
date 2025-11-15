const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Roun@k2006',
  database: process.env.DB_NAME || 'career_guidance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Get a promise-based connection
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
  connection.release();
});

// Export both pool and promisePool
module.exports = {
  pool,
  promisePool,
  connect: (callback) => {
    pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, connection);
      connection.release();
    });
  },
  query: (sql, params) => {
    return promisePool.execute(sql, params);
  }
};


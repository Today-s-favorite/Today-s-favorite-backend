const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10초로 설정
  charset: 'utf8mb4'
});

pool
  .getConnection()
  .then((conn) => {
    console.log("Connected to the database");
    conn.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

module.exports = pool;
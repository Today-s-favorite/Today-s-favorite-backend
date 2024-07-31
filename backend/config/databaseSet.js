const mysql = require("mysql2/promise");

// 환경 변수 출력 (디버깅용)
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
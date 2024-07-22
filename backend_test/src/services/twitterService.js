const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = require('../../config/databaseSet');

async function getTwitterDataByDate(date) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    console.log('Executing query'); // 디버깅을 위한 로그 추가
    const [rows] = await connection.query(
      "SELECT date_t, content, photo, post_url, video_url, twitter_video, heart, thumb_down FROM twitter WHERE DATE(date_t) = ?",
      [date]
    );
    console.log("Twitter data:", rows);
    return rows;
  } catch (error) {
    console.error('DB Select Error:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getTwitterDataByDate };

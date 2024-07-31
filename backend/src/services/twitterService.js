const pool = require('../../config/databaseSet');

// 주어진 날짜의 트위터 데이터를 가져오는 함수
async function getTwitterDataByDate(date) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    console.log('쿼리 실행 중'); // 디버깅을 위한 로그 추가
    const [rows] = await connection.query(
      "SELECT twitter_id, date_t, content, photo, post_url, video_url, twitter_video, heart, thumb_down FROM twitter WHERE DATE(date_t) = ?",
      [date]
    );
    console.log("트위터 데이터:", rows);
    return rows;
  } catch (error) {
    console.error('DB 선택 오류:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 트위터 게시물의 좋아요 수를 업데이트하는 함수
async function updateTwitterLikes(id, likes) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [result] = await connection.query(
      "UPDATE twitter SET heart = ? WHERE twitter_id = ?",
      [likes, id]
    );
    return result;
  } catch (error) {
    console.error('DB 업데이트 오류:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 트위터 게시물의 싫어요 수를 업데이트하는 함수
async function updateTwitterDislikes(id, dislikes) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [result] = await connection.query(
      "UPDATE twitter SET thumb_down = ? WHERE twitter_id = ?",
      [dislikes, id]
    );
    return result;
  } catch (error) {
    console.error('DB 업데이트 오류:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 트위터 게시물의 좋아요를 삭제하는 함수
async function deleteTwitterLikes(id) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [result] = await connection.query(
      "UPDATE twitter SET heart = 0 WHERE twitter_id = ?",
      [id]
    );
    return result;
  } catch (error) {
    console.error('DB 업데이트 오류:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// 트위터 게시물의 싫어요를 삭제하는 함수
async function deleteTwitterDislikes(id) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [result] = await connection.query(
      "UPDATE twitter SET thumb_down = 0 WHERE twitter_id = ?",
      [id]
    );
    return result;
  } catch (error) {
    console.error('DB 업데이트 오류:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getTwitterDataByDate, updateTwitterLikes, updateTwitterDislikes, deleteTwitterLikes, deleteTwitterDislikes };
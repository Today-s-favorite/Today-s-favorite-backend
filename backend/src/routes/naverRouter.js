const express = require('express');
const router = express.Router();
const { runNaverService } = require('../controllers/naverController');
const pool = require('../../config/databaseSet');

// 네이버 서비스 실행
router.post('/run', runNaverService);

// 네이버 기사 조회
router.get('/news', async (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).send('날짜를 입력해주세요');
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const [rows] = await connection.query("SELECT * FROM naver WHERE date_n = ? ORDER BY date_n DESC", [date]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).send('해당 날짜에 기사가 없습니다.');
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Failed to retrieve news from database:', error);
    res.status(500).send('네이버 기사를 조회하는 중 오류가 발생했습니다');
  }
});

// 네이버 기사 좋아요 증가
router.post('/news/:id/heart', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const [result] = await connection.query("UPDATE naver SET heart = heart + 1 WHERE naver_id = ?", [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).send('해당 기사를 찾을 수 없습니다.');
    }

    res.status(200).send('좋아요가 증가했습니다.');
  } catch (error) {
    console.error('Failed to update heart count:', error);
    res.status(500).send('좋아요를 증가하는 중 오류가 발생했습니다');
  }
});

// 네이버 기사 싫어요 증가
router.post('/news/:id/thumb_down', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const [result] = await connection.query("UPDATE naver SET thumb_down = thumb_down + 1 WHERE naver_id = ?", [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).send('해당 기사를 찾을 수 없습니다.');
    }

    res.status(200).send('싫어요가 증가했습니다.');
  } catch (error) {
    console.error('Failed to update thumb_down count:', error);
    res.status(500).send('싫어요를 증가하는 중 오류가 발생했습니다');
  }
});

module.exports = router;
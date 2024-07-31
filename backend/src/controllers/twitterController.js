const { getTwitterDataByDate, updateTwitterLikes, updateTwitterDislikes, deleteTwitterLikes, deleteTwitterDislikes } = require('../services/twitterService');

// 주어진 날짜의 트위터 데이터를 가져오는 컨트롤러 함수
const runTwitterService = async (req, res) => {
  console.log('컨트롤러 함수 호출됨'); // 디버깅을 위한 로그 추가
  const date = req.query.date; // 클라이언트가 쿼리 파라미터로 날짜를 보냄
  if (!date) {
    return res.status(400).send({ error: '날짜 쿼리 파라미터가 필요합니다.' });
  }

  try {
    const data = await getTwitterDataByDate(date);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: '내부 서버 오류', details: error.message });
  }
};

// 트윗에 좋아요를 추가하는 컨트롤러 함수
const likeTweet = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;
  if (!id || likes === undefined) {
    return res.status(400).send({ error: '트윗 ID와 좋아요 수가 필요합니다.' });
  }

  try {
    const result = await updateTwitterLikes(id, likes);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: '내부 서버 오류', details: error.message });
  }
};

// 트윗에 싫어요를 추가하는 컨트롤러 함수
const dislikeTweet = async (req, res) => {
  const { id } = req.params;
  const { dislikes } = req.body;
  if (!id || dislikes === undefined) {
    return res.status(400).send({ error: '트윗 ID와 싫어요 수가 필요합니다.' });
  }

  try {
    const result = await updateTwitterDislikes(id, dislikes);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: '내부 서버 오류', details: error.message });
  }
};

// 트윗의 좋아요를 삭제하는 컨트롤러 함수
const removeLike = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ error: '트윗 ID가 필요합니다.' });
  }

  try {
    const result = await deleteTwitterLikes(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: '내부 서버 오류', details: error.message });
  }
};

// 트윗의 싫어요를 삭제하는 컨트롤러 함수
const removeDislike = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ error: '트윗 ID가 필요합니다.' });
  }

  try {
    const result = await deleteTwitterDislikes(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: '내부 서버 오류', details: error.message });
  }
};

module.exports = { runTwitterService, likeTweet, dislikeTweet, removeLike, removeDislike };
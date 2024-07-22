// 여기 이름은 서비스에 생성한 함수랑 같게
const { getTwitterDataByDate } = require('../services/twitterService'); // 경로가 올바른지 확인


// 라우터랑 여기 이름이랑 같아야 함
const runTwitterService = async (req, res) => {
  console.log('Controller function called'); // 디버깅을 위한 로그 추가
  const date = req.query.date; // 클라이언트가 쿼리 파라미터로 날짜를 보냄
  if (!date) {
    return res.status(400).send({ error: 'Date query parameter is required' });
  }

  try {
    const data = await getTwitterDataByDate(date);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error', details: error.message });
  }
};


module.exports = { runTwitterService };
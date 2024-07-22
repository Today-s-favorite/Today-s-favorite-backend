const naverService = require('../services/naverService'); // 경로가 올바른지 확인
const cron = require('node-cron');

const runNaverService = async (req, res) => {
  try {
    await naverService.main();
    res.status(200).send('네이버 서비스가 성공적으로 실행되었습니다');
  } catch (error) {
    console.error(error);
    res.status(500).send('네이버 서비스를 실행하는 중 오류가 발생했습니다');
  }
};

// 12시간마다 네이버 서비스 실행
cron.schedule('0 */12 * * *', async () => {
  try {
    await naverService.main();
    console.log('네이버 서비스가 성공적으로 실행되었습니다');
  } catch (error) {
    console.error('네이버 서비스를 실행하는 중 오류가 발생했습니다', error);
  }
});

module.exports = { runNaverService };
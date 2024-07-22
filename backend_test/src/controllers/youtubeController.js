const youtubeService = require('./youtubeService');

async function getAndSaveVideos(req, res) {
  const artistName = req.params.artistName;

  try {
    const videos = await youtubeService.searchOfficialVideos(artistName);
    youtubeService.saveVideosToDatabase(videos);
    youtubeService.generateHtml(videos, artistName);
    res.status(200).send(`${artistName}의 동영상 정보가 저장되고 HTML 파일이 생성되었습니다.`);
  } catch (error) {
    res.status(500).send('동영상 정보를 가져오는 중 오류가 발생했습니다.');
  }
}

function updateLikes(req, res) {
  const youtubeId = req.params.youtubeId;
  const isLike = req.params.type === 'like';

  try {
    youtubeService.updateLikes(youtubeId, isLike);
    res.status(200).send(`${isLike ? 'Like' : 'Dislike'} updated for youtube_id ${youtubeId}`);
  } catch (error) {
    res.status(500).send('좋아요/싫어요 업데이트 중 오류가 발생했습니다.');
  }
}

module.exports = {
  getAndSaveVideos,
  updateLikes
};
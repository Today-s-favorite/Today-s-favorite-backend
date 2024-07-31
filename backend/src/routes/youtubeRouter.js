const express = require('express');
const router = express.Router();
const YoutubeController = require('../controllers/youtubeController');

// 모든 비디오를 가져오는 라우트
router.get('/videos', YoutubeController.getAllVideos);

// 비디오에 좋아요를 추가하는 라우트
router.post('/videos/:id/like', YoutubeController.likeVideo);

// 비디오에 싫어요를 추가하는 라우트
router.post('/videos/:id/dislike', YoutubeController.dislikeVideo);

// 비디오에 좋아요를 취소하는 라우트
router.delete('/videos/:id/like', YoutubeController.unlikeVideo);

// 비디오에 싫어요를 취소하는 라우트
router.delete('/videos/:id/dislike', YoutubeController.undislikeVideo);

// 날짜별 비디오를 가져오는 라우트
router.get('/videos/date/:date', YoutubeController.getVideosByDate);

// YouTube 비디오 데이터를 크롤링하는 라우트
router.post('/crawl', YoutubeController.crawlYouTubeVideos);

module.exports = router;
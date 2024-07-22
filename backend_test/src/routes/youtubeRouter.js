const express = require('express');
const router = express.Router();
const youtubeController = require('./youtubeController');

router.get('/youtube/:artistName', youtubeController.getAndSaveVideos);
router.post('/youtube/:youtubeId/:type', youtubeController.updateLikes); // 'like' 또는 'dislike' 타입을 받는 경로

module.exports = router;
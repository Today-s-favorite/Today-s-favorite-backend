const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

router.get('/media', instagramController.getMediaByDate);
router.post('/media/heart', instagramController.updateHeart);  // 좋아요 업데이트
router.post('/media/thumb_down', instagramController.updateThumbDown);  // 싫어요 업데이트

module.exports = router;
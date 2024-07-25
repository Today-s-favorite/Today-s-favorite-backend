const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

// 모든 게시물 조회
router.get('/posts', instagramController.getAllPosts);

// 특정 날짜의 게시물 조회
router.get('/posts/date/:date', instagramController.getPostsByDate);

// 특정 게시물에 좋아요 추가
router.post('/posts/:instagram_id/like', instagramController.addLike);

// 특정 게시물에서 좋아요 취소
router.delete('/posts/:instagram_id/like', instagramController.removeLike);

// 특정 게시물에 싫어요 추가
router.post('/posts/:instagram_id/dislike', instagramController.addDislike);

// 특정 게시물에서 싫어요 취소
router.delete('/posts/:instagram_id/dislike', instagramController.removeDislike);

module.exports = router;
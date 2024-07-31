const express = require('express');
const router = express.Router();
const { runTwitterService, likeTweet, dislikeTweet, removeLike, removeDislike } = require('../controllers/twitterController');

// GET 요청을 처리하여 주어진 날짜의 트위터 데이터를 가져옴
router.get('/', runTwitterService);

// POST 요청을 처리하여 트윗에 좋아요를 추가
router.post('/:id/like', likeTweet);

// POST 요청을 처리하여 트윗에 싫어요를 추가
router.post('/:id/dislike', dislikeTweet);

// DELETE 요청을 처리하여 트윗의 좋아요를 삭제
router.delete('/:id/like', removeLike);

// DELETE 요청을 처리하여 트윗의 싫어요를 삭제
router.delete('/:id/dislike', removeDislike);

module.exports = router;
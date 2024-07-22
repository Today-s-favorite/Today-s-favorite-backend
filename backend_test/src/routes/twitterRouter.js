const express = require('express');
const router = express.Router();
const { runTwitterService } = require('../controllers/twitterController');

router.get('/', runTwitterService);

module.exports = router;
const express = require('express');
const router = express.Router();
const { runNaverService } = require('../controllers/naverController');

router.post('/run', runNaverService);

module.exports = router;
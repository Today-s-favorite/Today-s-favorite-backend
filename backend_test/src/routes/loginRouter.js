const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// 라우트에서 뷰 렌더링
router.get('/login', (req, res) => {
    res.render('login');
  });

router.post("/", loginController.login);

module.exports = router;
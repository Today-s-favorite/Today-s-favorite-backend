const express = require("express");
const router = express.Router();
const { signUp, auth, emailCheck, signUpOrLogin } = require("../controllers/signUpController");
const axios = require('axios');
const querystring = require('querystring');
const signUpService = require('../services/signUpService');
require('dotenv').config();

// 라우트에서 뷰 렌더링
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'signup' });
});

router.post("/signup", signUp);
router.post("/auth", auth);
router.post("/authcheck", emailCheck);
router.post("/signupOrLogin", signUpOrLogin);

router.get('/google', (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${process.env.GOOGLE_LOGIN_REDIRECT_URI}`;
  url += '&response_type=code';
  url += '&scope=email profile';
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_LOGIN_REDIRECT_URI,
      grant_type: 'authorization_code'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = tokenResponse.data;
    const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
    const { name, email } = userInfoResponse.data;

    let user = await signUpService.findUser(email);

    if (user.length === 0) {
      let result = await signUpService.googleSign(name, email);
      res.cookie("user_id", result.insertId, { path: '/', secure: false });
      res.cookie("role", 0, { path: '/', secure: false });
    } else {
      res.cookie("user_id", user[0].user_id, { path: '/', secure: false });
      res.cookie("role", 0, { path: '/', secure: false });
    }

    res.redirect('http://localhost:3000');
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
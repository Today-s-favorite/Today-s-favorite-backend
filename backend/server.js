const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const session = require("express-session");
const signUpRouter = require("./src/routes/signUpRouter");
const loginRouter = require("./src/routes/loginRouter");
const logoutRouter = require("./src/routes/logoutRouter");
const mypageRouter = require("./src/routes/mypageRouter");
const resetPasswordRouter = require("./src/routes/resetPasswordRouter");
const passwordRouter = require('./src/routes/passwordRouter');
const adminRouter = require('./src/routes/adminRouter');
const naverRouter = require('./src/routes/naverRouter');
const youtubeRouter = require('./src/routes/youtubeRouter'); // 새로운 YouTube 라우터 불러오기
const instagramRouter = require('./src/routes/instagramRouter'); // 새로운 Instagram 라우터 불러오기
const twitterRouter = require('./src/routes/twitterRouter'); // 새로운 Twitter 라우터 불러오기

const app = express();

// 환경 변수 출력 (디버깅용)
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("SESSION_SECRET_KEY:", process.env.SESSION_SECRET_KEY);

// CORS 설정
app.use(cors());

// JSON 파싱을 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

// 라우터 설정
app.use("/sign", signUpRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/mypage", mypageRouter);
app.use('/admin', adminRouter);
app.use("/", resetPasswordRouter);
app.use('/password', passwordRouter);
app.use('/naver', naverRouter); // 새로운 네이버 라우터 사용
app.use('/api', youtubeRouter); // 새로운 YouTube 라우터 사용
app.use('/instagram', instagramRouter); // 새로운 Instagram 라우터 사용
app.use('/twitter', twitterRouter); // 새로운 Twitter 라우터 사용

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '내부 서버 오류', error: err.message });
});

// 서버 시작
app.listen(3000, () => {
  console.log('서버가 포트 3000에서 실행 중입니다.');
});
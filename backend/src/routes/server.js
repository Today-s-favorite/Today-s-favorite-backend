const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const signUpRouter = require("./signUpRouter");
const loginRouter = require("./loginRouter");
const logoutRouter = require("./logoutRouter");
const mypageRouter = require("./mypageRouter");
const resetPasswordRouter = require("./resetPasswordRouter");
const passwordRouter = require('./passwordRouter');
const adminRouter = require('./adminRouter');
const naverRouter = require('./naverRouter');
const youtubeRouter = require('./youtubeRouter'); // 새로운 YouTube 라우터 불러오기
const mysql = require('mysql');
const instagramRouter = require('./instagramRouter'); // 새로운 Instagram 라우터 불러오기

// 환경 변수 설정
dotenv.config({ path: './src/routes/.env' });

const app = express();

// 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err);
  } else {
    console.log('데이터베이스 연결 성공');
  }
});

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

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
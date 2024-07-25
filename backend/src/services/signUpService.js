const pool = require('../../config/databaseSet');
const { hashPassword } = require('../utils/cryptoUtils');
const crypto = require('crypto');

// 회원가입 서비스
const signUp = async (user) => {
  const { user_id, user_name, user_pw, nickname, one_favorite, email, user_intro, profile_picture } = user;

  try {
    const [existingUsers] = await pool.query(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return { success: false, error: '이미 등록된 이메일입니다.' };
    }

    const user_salt = crypto.randomBytes(32).toString('hex');
    const hashedPassword = hashPassword(user_pw, user_salt);

    const [result] = await pool.query(
      'INSERT INTO user (user_id, user_name, user_pw, user_salt, nickname, one_favorite, email, user_intro, profile_picture, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [user_id, user_name, hashedPassword, user_salt, nickname, one_favorite, email, user_intro, profile_picture]
    );

    if (result.affectedRows > 0) {
      return { success: true, id: result.insertId };
    } else {
      return { success: false, error: '회원가입에 실패했습니다.' };
    }
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error: '서버 에러가 발생했습니다.' };
  }
};

// 사용자 찾기 서비스
const findUser = async (email) => {
  try {
    const [result] = await pool.query(
      'SELECT user_id, email FROM user WHERE email = ?',
      [email]
    );
    return result;
  } catch (error) {
    console.error('Error finding user:', error);
    throw new Error('서버 에러가 발생했습니다.');
  }
};

// 구글 회원가입 서비스
const googleSign = async (displayName, email) => {
  try {
    const user_salt = crypto.randomBytes(32).toString('hex');
    const hashedPassword = hashPassword('defaultPassword', user_salt);

    const [result] = await pool.query(
      'INSERT INTO user (user_id, user_name, user_pw, user_salt, nickname, one_favorite, email, user_intro, profile_picture, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [displayName, displayName, hashedPassword, user_salt, displayName, "", email, "", ""]
    );

    return result;
  } catch (error) {
    console.error('Error with Google signup:', error);
    throw new Error('서버 에러가 발생했습니다.');
  }
};

// 이메일 인증 코드 생성 서비스
const createCode = () => {
  let n = Math.floor(Math.random() * 1000000);
  return n.toString().padStart(6, "0");
};

// 이메일 중복 확인 서비스
const emailCheck = async (email, res) => {
  let sql = `SELECT user_id FROM user WHERE email = ?`;

  try {
    let [result] = await pool.query(sql, [email]);

    if (result.length === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

module.exports = { signUp, findUser, googleSign, createCode, emailCheck };
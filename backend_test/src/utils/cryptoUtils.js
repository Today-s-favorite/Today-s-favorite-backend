const crypto = require('crypto');

const hashPassword = (password, salt) => {
  if (typeof password !== 'string') {
    throw new TypeError('패스워드는 문자열이어야 합니다');
  }

  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

const comparePassword = (inputPassword, hashedPassword, salt) => {
  const hash = hashPassword(inputPassword, salt);
  return hash === hashedPassword;
};

module.exports = { hashPassword, comparePassword };
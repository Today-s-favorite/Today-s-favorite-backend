const logoutService = require("../services/logoutService.js");

const logout = (req, res) => {
  logoutService.invalidateSession();
  res.status(200).send("로그아웃이 성공적으로 처리되었습니다.");
};

module.exports = { logout };
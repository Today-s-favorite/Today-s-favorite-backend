const signUpService = require("../services/signUpService");
const loginService = require("../services/loginService");
const mailer = require("./mailer");

// 회원가입 컨트롤러
const signUp = async (req, res) => {
  const { user_id, user_name, user_pw, nickname, one_favorite, email, user_intro, profile_picture } = req.body;

  if (!user_id || !user_name || !user_pw || !nickname || !one_favorite || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await signUpService.signUp(req.body);
    if (result.success) {
      res.status(201).json({
        message: "회원가입이 성공적으로 완료되었습니다.",
        user_id: result.id,
      });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error in signUp controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const auth = async (req, res) => {
  const { email } = req.body;
  const code = signUpService.createCode();

  try {
    const check = await signUpService.emailCheck(email, res);

    if (!check) {
      res.status(400).send({ success: false, message: "이미 가입된 이메일이 있습니다." });
      return;
    }
    await mailer.sendMail(
      email,
      "<오늘의 최애> 이메일 인증코드입니다",
      `<p>이메일 인증코드입니다. ${code}를 입력해주세요</p>`, res
    );

    req.session[email] = code;

  } catch (error) {
    console.error("Error in auth controller:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

const emailCheck = (req, res) => {
  const { authcode, email } = req.body;

  if (req.session[email] != authcode) {
    res.status(200).send({ success: false, message: authcode });
  } else {
    delete req.session[email];
    res.status(200).send({ success: true, message: "인증번호가 일치합니다." });
  }
};

const signUpOrLogin = async (req, res) => {
  const { email, username, nickname, password } = req.body;

  try {
    const existingUser = await signUpService.checkEmailExists(email);
    if (existingUser) {
      const isAuthenticated = await loginService.authenticate(email, password);
      if (isAuthenticated) {
        return res.status(204).json({ user_id: existingUser.user_id });
      } else {
        return res.status(401).send("인증에 실패하였습니다. 올바른 사용자 이름과 비밀번호를 입력해주세요.");
      }
    } else {
      const result = await signUpService.signUp(username, nickname, email, password);
      if (result.success) {
        res.status(200).json({ user_id: result.id, message: "회원가입이 성공적으로 완료되었습니다." });
      } else {
        res.status(400).json({ message: result.error });
      }
    }
  } catch (error) {
    console.error("Error in signUpOrLogin controller:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

module.exports = { signUp, auth, emailCheck, signUpOrLogin };
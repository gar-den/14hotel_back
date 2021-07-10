// 정훈

const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { nickname, email, password, confirmPassword } = req.body;
  const regExp = new RegExp(
    /^([0-9a-zA-Z]+)@([0-9a-zA-Z]+)[.]([a-zA-Z]*)/,
    "i"
  );

  const schema = Joi.object({
    nickname: Joi.string().min(4),
    password: Joi.string().min(4),
    email: Joi.string().pattern(regExp),
  });

  if (password.includes(nickname) || password.includes(email)) {
    // return res.status(401).json({
    //   message: "비밀번호에는 닉네임이나 이메일이 포함될 수 없습니다.",
    // });
    return res.json({
      message: "비밀번호에는 닉네임이나 이메일이 포함될 수 없습니다.",
    });
  }

  if (password !== confirmPassword) {
    // return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    return res.json({ message: "비밀번호가 일치하지 않습니다." });
  }

  try {
    const { _, error } = schema.validate({ nickname, email, password });

    if (error) {
      const errorPath = error["details"][0]["path"][0];
      return res.json({ message: `${errorPath}를 다시 확인하세요` });
    }

    const isExist = await User.exists({ $or: [{ nickname }, { email }] });
    console.log(isExist);
    if (isExist === true) {
      //   return res
      //     .status(401)
      //     .json({ message: "님네임이나 이메일이 중복됩니다. " });
      // }
      return res.json({ message: "님네임이나 이메일이 중복됩니다. " });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      nickname,
      email,
      password: hashedPassword,
    });

    return res.json({ message: "success" });
  } catch (e) {
    console.log(e);
    return res.json({
      message: "알수없는 오류가 발생했습니다. 관리자에게 문의하세요.",
    });
  }
});

router.post("/auth", async (req, res) => {
  const { email, password: oldOne } = req.body;
  try {
    const user = await User.findOne({ email, password });
    const isPasswordCorrect = await bcrypt.compare(oldOne, user.password);
    if (!user || !isPasswordCorrect) {
      // return res.status(401).json({ message: "존재하지 않는 계정입니다." });
      return res.json({ message: "존재하지 않는 계정입니다." });
    }
    //허허 토큰..
    // const token = await jwt.sign({ nickname: user.nickname }, "secret");

    req.session.loggedIn = true;
    req.session.user = user.nickName;

    return res.json({ message: "success" });
  } catch (e) {
    console.log(e);
    return res.json({
      message: "알수없는 오류가 발생했습니다. 관리자에게 문의하세요.",
    });
  }
});

//로그아웃 요청을 받을 때만 살려주면됩니다.(사용할지 안할지 모름)
// router.post("/logout", (req, res) => {
//   req.session.destroy();
//   //이거 어떻게 응답 할지 정해야 함.
//   return res.end();
// });

module.exports = router;
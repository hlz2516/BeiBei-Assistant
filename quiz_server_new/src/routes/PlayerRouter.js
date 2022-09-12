const express = require("express");
const playerServ = require("../services/PlayerService");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../common/sec.js");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const name = req.body["name"];
  const password = req.body["password"];

  try {
    let player = await playerServ.findByName(name);
    if (!player) {
      player = await playerServ.insert(name, password);
      if (!player) {
        res.status(500).json({
          status: 500,
          msg: "create a player error,please contact developer",
        });
        return;
      }
    } else {
      let pwdPassed = false;
      pwdPassed = await playerServ.checkPassword(player.dataValues, password);
      if (pwdPassed === false) {
        res.json({
          status: 207,
          msg: "Password verification failed",
        });
        return;
      }
    }
    //到这里的有两种情况：用户第一次创建和校验密码通过的
    //创建jwt并返回
    const tokenStr = jwt.sign(
      { id: player.dataValues["id"], name: player.dataValues["name"] },
      secretKey,
      { expiresIn: "6h" }
    );
    res.status(200).json({
      msg: "log in success",
      token: tokenStr,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

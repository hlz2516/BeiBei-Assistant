const express = require("express");
const playerServ = require("../services/PlayerService");
const repoServ = require("../services/RepoService");
const router = express.Router();

function checkUserValid(req) {
    const id = req.auth.id;
    if (id < 1) {
      return new Error(`用户验证失败，id：${id}`);
    }
    return id;
}

router.get("/repos", async (req, res, next) => {
  try {
    checkUserValid(req);
    //找到用户下所有的题库
    const repos = await playerServ.getRepos();
    //遍历题库，找到每个题库下的题目数量,封装数据
    let msg = [];
    for (let index = 0; index < repos.length; index++) {
      const repo = repos[index];
      console.log("repo id", repo.dataValues["id"]);
      const quizCount = await repoServ.getQuizCount(repo.dataValues["id"]);
      msg.push({
        name: repo.dataValues["name"],
        quizCount,
      });
    }

    res.json({
      msg,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/repoadd", async (req, res, next) => {
  try {
    const id = checkUserValid(req);
    const repoName = req.body["name"];
    await repoServ.insert(repoName, id);

    res.json({
      msg: "OK",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/repoedit',async (req,res,next)=>{
    try {
        const id = checkUserValid(req);
        let oldName = req.body['oldName'];
        let newName = req.body['newName'];
        let repo = await repoServ.findByName(oldName,id);
        repo.setDataValue('name',newName);
        const effects = await repoServ.updateName(repo.dataValues);
        if (effects > 0) {
            res.json({
                msg:'update OK',
                status:200
            })
        }else{
            res.json({
                msg:'update error',
                status:200
            })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;

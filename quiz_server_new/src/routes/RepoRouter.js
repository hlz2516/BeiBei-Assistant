const express = require("express");
const playerServ = require("../services/PlayerService");
const repoServ = require("../services/RepoService");
const {download,upload} = require('../common/dbContext')
const {randomString, checkUserValid} = require('../common')
const router = express.Router();

router.get("/repos", async (req, res, next) => {
  try {
    const id = checkUserValid(req);
    //找到用户下所有的题库
    const repos = await playerServ.getRepos(id);
    //遍历题库，找到每个题库下的题目数量,封装数据
    let msg = [];
    for (let index = 0; index < repos.length; index++) {
      const repo = repos[index];
      const quizCount = await repoServ.getQuizCount(repo.dataValues["id"]);
      msg.push({
        name: repo.dataValues["name"],
        quizCount,
        origin:repo.dataValues["origin"]
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

router.get("/repos/name",async (req,res,next)=>{
  try {
    const id = checkUserValid(req);
    let repos = await playerServ.getRepos(id);
    repos = repos.map(repo=>{
      return repo.getDataValue('name');
    })
    res.json({
      repos,
      status:200
    })
  } catch (error) {
    next(error)
  }
})

router.post("/repo/add", async (req, res, next) => {
  try {
    const id = checkUserValid(req);
    const repoName = req.body["name"];
    let result = await repoServ.insert(repoName, id);
    if (!result) {
      res.json({
        msg:'插入失败',
        status:503
      });
      return;
    }
    res.json({
      msg: "OK",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/repo/edit',async (req,res,next)=>{
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
                status:504
            })
        }
    } catch (error) {
        next(error)
    }
})

router.post('/repo/download',async (req,res,next)=>{
  try {
    const userId = checkUserValid(req);
    const code = req.body['code'];
    const result = await download(userId,code);
    if (result === 0) {
      res.json({
        msg:'OK',
        status:200
      })
    }
  } catch (error) {
    next(error);
  }
})

router.post('/repo/upload',async (req,res,next)=>{
  try {
    const userId = checkUserValid(req);
    const repoName = req.body['name'];
    const repo = await repoServ.findByName(repoName,userId);
    const repoId = repo.getDataValue('id')
    const origin = randomString(6);
    let result = await upload(repoId,origin);
    if (result === 0) {
      //更新个人题库的origin
      result = await repoServ.updateOrigin({id:repoId,origin});
      res.json({
        origin,
        status:200
      })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router;

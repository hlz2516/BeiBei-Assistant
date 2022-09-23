const express = require("express");
const pubRepoServ = require("../services/PubRepoService");
const playerServ = require("../services/PlayerService");
const { checkUserValid } = require("../common");

const router = express.Router();

router.get("/pubrepos", async (req, res, next) => {
  try {
    const pubRepos = await pubRepoServ.findAll();
    res.json({
      data: pubRepos,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/comment/add", async (req, res, next) => {
  try {
    const code = req.body["code"];
    const comment = req.body["comment"];
    const userId = checkUserValid(req);
    const player = await playerServ.findById(userId);
    const model = await pubRepoServ.addComment(
      player.getDataValue("name"),
      code,
      comment
    );
    res.json({
      comment:model.dataValues,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/comments',async (req,res,next)=>{
    try {
        const code = req.query['code'];
        let comments = await pubRepoServ.getComments(code);
        console.log('comments',comments);
        res.json({
            comments,
            status:200
        })
    } catch (error) {
        next(error);
    }
})

module.exports = router;

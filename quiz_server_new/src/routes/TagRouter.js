const express = require("express");
const tagServ = require("../services/TagService");
const repoServ = require("../services/RepoService");
const router = express.Router();
const { checkUserValid } = require("../common");
const { findTagsByRepo } = require("../common/dbContext");

router.get("/tags", async (req, res, next) => {
  try {
    const tags = await tagServ.findAll();
    const tagsName = tags.map((tag) => {
      return tag.getDataValue("name");
    });

    res.json({
      tags: tagsName,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/tags_in_repo", async (req, res, next) => {
  try {
    const playerId = checkUserValid(req);
    let repoName = req.query["repoName"];
    let repoModel = await repoServ.findByName(repoName, playerId);
    let results = await findTagsByRepo(repoModel.getDataValue("id"));
    results = results.map((result) => {
      return result.name;
    });
    res.json({
      data: results,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

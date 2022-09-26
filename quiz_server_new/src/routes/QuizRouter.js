const express = require("express");
const playerServ = require("../services/PlayerService");
const repoServ = require("../services/RepoService");
const quizServ = require("../services/QuizService");
const tagServ = require("../services/TagService");
const TagQuizs = require("../daos/TagQuizs");
const { checkUserValid } = require("../common");
const {
  remCoreQuery,
  findTagsName,
  findQuizByLevel,
} = require("../common/dbContext");
const router = express.Router();
/**
 * 
 * @param {*} quizs 
 * quizs结构：[
 *  {
 *    id:1,
 *    repoId:3
 *    question:'xxxx',
 *    answer:'xxx'
 *    //注意，quiz模型中没有tags字段，所以这个方法就是输入quiz模型(仅dataValues)，找到其tags并作为quiz模型的属性
 *    //新增的tags属性值结构：["java","c#"]
 *    //这个方法也会把新增repoName属性，根据repoId找到
 *  }
 * ]
 * @returns 
 */
async function wrapQuizs(quizs) {
  try {
    for (let i = 0; i < quizs.length; i++) {
      let quizId = quizs[i].id;
      let tags = await findTagsName(quizId);
      tags = tags.map((tag) => {
        return tag.name;
      });
      quizs[i].tags = tags;
      //result中每个quiz的repoid需转换成对应repo名返回回去
      let repo = await repoServ.findById(quizs[i].repoId);
      quizs[i].repoName = repo.getDataValue("name");
    }
    return quizs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

router.post("/quiz/add", async (req, res, next) => {
  try {
    const id = checkUserValid(req);
    const quizId = req.body["id"];
    const question = req.body["question"];
    const answer = req.body["answer"];
    const references = req.body["references"];
    const tags = req.body["tags"];
    const importance = req.body["importances"];
    const inRepo = req.body["repo"];

    //检查quizId是否为0，若为0则是新建题目
    if (quizId === 0) {
      const repo = await repoServ.findByName(inRepo, id);
      const repoId = repo.getDataValue("id");
      const quiz = await quizServ.insert(
        {
          question,
          answer,
          importance,
          references,
        },
        repoId,
        tags,
        id
      );

      //返回新的quizId给客户端
      const newQuizId = quiz.getDataValue("id");
      res.json({
        quizId: newQuizId,
        status: 200,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/quiz/update", async (req, res, next) => {
  try {
    const id = checkUserValid(req);
    const quizId = req.body["id"];
    const question = req.body["question"];
    const answer = req.body["answer"];
    const references = req.body["references"];
    const tags = req.body["tags"];
    const importance = req.body["importances"];
    const inRepo = req.body["repo"];
    //先看quizId是否存在quiz表中
    let quiz = await quizServ.findById(quizId);
    if (quiz) {
      //查找repoId
      let thisRepo = await repoServ.findByName(inRepo, id);
      //更新
      if (thisRepo) {
        let result = await quizServ.update(
          {
            id: quiz.getDataValue("id"),
            question,
            answer,
            references,
            importance,
          },
          thisRepo.getDataValue("id"),
          tags,
          id
        );

        if (result > 0) {
          res.json({
            msg: "update OK",
            status: 200,
          });
        }
        return;
      }
    }
    res.json({ msg: "udpate error", status: 500 });
  } catch (error) {
    next(error);
  }
});

router.post("/quiz/setlevel", async (req, res, next) => {
  try {
    const quizId = req.body["quizId"];
    const level = req.body["level"];
    await quizServ.updateLevel({ id: quizId, level });

    res.json({
      msg: "OK",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

//只根据关键字进行搜索，会同时在id，问题或答案，tags等等里面搜索
router.get("/quiz/quicksearch", async (req, res, next) => {
  try {
    const key = req.query["key"];
    const id = checkUserValid(req);
    const result = [];
    //特殊搜索，被[]包裹的关键词为level
    if (key.startsWith("[") && key.endsWith("]")) {
      let level = key.substring(1, key.length - 1);
      //查找指定level的题目，不做题库等限制
      let quizs = await findQuizByLevel(id, level);
      quizs = await wrapQuizs(quizs);
      res.json({
        data: quizs,
        status: 200,
      });
      return;
    }

    //特殊搜索，被<>包裹的关键词为题库名
    if (key.startsWith("<") && key.endsWith(">")) {
      let repoName = key.substring(1, key.length - 1);
      let repoModel = await repoServ.findByName(repoName,id);
      let quizs = await repoServ.getQuizs(repoModel.dataValues);
      quizs = quizs.map(model=>{
        return model.dataValues;
      })
      quizs = await wrapQuizs(quizs);
      res.json({
        data:quizs,
        status:200
      })
      return
    }

    // console.log("key", key);
    //如果key是数字，那么会优先认为是一个quiz id
    if (!isNaN(key)) {
      let quiz = await quizServ.findById(Number(key));
      result.push(quiz.dataValues);
    }
    //在问题或答案中寻找
    let someQuizs = await quizServ.findByQuestionOrAnswer({
      question: key,
      answer: key,
    });
    if (someQuizs) {
      someQuizs.forEach((quiz) => {
        result.push(quiz.dataValues);
      });
    }
    //在题库名中查找
    let repo = await repoServ.findByName(key, id);
    if (repo) {
      let quizInRepo = await repoServ.getQuizs(repo.dataValues);
      if (quizInRepo) {
        quizInRepo.forEach((quiz) => {
          result.push(quiz.dataValues);
        });
      }
    }
    //如果跟某个标签名相同，则返回该用户所有题库下的有关该标签的所有题目
    let tag = await tagServ.findByName(key);
    if (tag) {
      let records = await TagQuizs.findAll({
        where: {
          tagId: tag.getDataValue("id"),
          playerId: id,
        },
      });
      records.forEach(async (record) => {
        let data = record.dataValues;
        let quizId = data.quizId;
        let q = await quizServ.findById(quizId);
        result.push(q.dataValues);
      });
    }

    for (let i = 0; i < result.length; i++) {
      //找到每个quiz的tags封装进去
      let tags = await findTagsName(result[i].id);
      tags = tags.map((tag) => {
        return tag.name;
      });
      result[i].tags = tags;
      //result中每个quiz的repoid需转换成对应repo名返回回去
      let repo = await repoServ.findById(result[i].repoId);
      result[i].repoName = repo.getDataValue("name");
    }

    res.json({ data: result, status: 200 });
  } catch (error) {
    next(error);
  }
});

router.get("/quiz/rem", async (req, res, next) => {
  try {
    const userId = checkUserValid(req);
    const total = req.query["number"];
    const repoName = req.query["repo"];
    const imp = req.query["importance"];
    let tagName = req.query["tag"];
    const data = [];
    //未知:已理解:已熟悉
    const ratio = [0.5, 0.4, 0.1];
    //计算预计的具体每个理解程度的select数量
    let planUnknowned = Math.ceil(total * ratio[0]);
    let planUnderstood = Math.ceil(total * ratio[1]);
    let planFamiliared = total - planUnknowned - planUnderstood;
    //处理标签和重要程度
    let imps = [];
    if (imp === "全部") {
      imps = ["重要", "理解", "了解", "未知"];
    } else imps.push(imp);

    if (tagName === "全部") {
      tagName = null;
    }

    let repoModel = await repoServ.findByName(repoName, userId);
    const repoId = repoModel.getDataValue("id");
    //根据条件找熟悉的
    let familiarRes = await remCoreQuery(
      userId,
      repoId,
      imps,
      "已熟悉",
      planFamiliared,
      tagName
    );

    familiarRes = await wrapQuizs(familiarRes);
    data.push(...familiarRes);
    //如果查到的记录条数不满足预期，那么在预期的未知记录上加上该差值
    if (familiarRes.length < planFamiliared) {
      planUnknowned += planFamiliared - familiarRes.length;
    }
    //根据条件找理解的
    let understoodRes = await remCoreQuery(
      userId,
      repoId,
      imps,
      "已理解",
      planUnderstood,
      tagName
    );

    understoodRes = await wrapQuizs(understoodRes);
    data.push(...understoodRes);

    //对于已理解查到的记录数同理
    if (understoodRes.length < planUnderstood) {
      planUnknowned += planUnderstood - understoodRes.length;
    }
    //根据条件查未知的
    let unknownRes = await remCoreQuery(
      userId,
      repoId,
      imps,
      "未知",
      planUnknowned,
      tagName
    );

    unknownRes = await wrapQuizs(unknownRes);
    data.push(...unknownRes);

    res.json({
      data,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/quiz/del", async (req, res, next) => {
  try {
    let quizId = req.body["quizId"];
    //在tagquizs表中找到该quizId，删除
    await quizServ.removeById(quizId);

    res.json({
      msg: "OK",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/quiz/remIncrease",async (req,res,next)=>{
  try {
    const quizId = req.body['quizId'];
    await quizServ.remIncrease({id:quizId});
    res.json({
      status:200
    })
  } catch (error) {
    next(error);
  }
})

module.exports = router;

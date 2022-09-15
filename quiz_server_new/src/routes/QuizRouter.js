const express = require("express");
const playerServ = require("../services/PlayerService");
const repoServ = require("../services/RepoService");
const quizServ = require("../services/QuizService");
const tagServ = require('../services/TagService');
const TagQuizs = require('../daos/TagQuizs');
const {checkUserValid, objfy} = require('../common');
const router = express.Router();

router.post('/quiz/add',async (req,res,next)=>{
    try {
        const id = checkUserValid(req);
        const quizId = req.body["id"];
        const question = req.body["question"];
        const answer = req.body["answer"];
        const references = req.body["references"];
        const tags = req.body["tags"];
        const importance = req.body["importances"];
        const inRepo = req.body["repo"];

        //检查quizId是否为0，若为0则是新建题目，否则为修改题目
        if (quizId === 0) {
            const repo = await repoServ.findByName(inRepo,id);
            const repoId = repo.getDataValue('id');
            const quiz = await quizServ.insert({
                question,answer,importance,references
            },repoId,tags,id);

            //返回新的quizId给客户端
            const newQuizId = quiz.getDataValue('id');
            res.json({
                quizId:newQuizId,
                status:200
            })
        }
        else{

        }
    } catch (error) {
        next(error)
    }
})

//只根据关键字进行搜索，会同时在id，问题或答案，tags等等里面搜索
router.get('/quiz/quicksearch',async (req,res,next)=>{
    try {
        const key = req.query['key'];
        const id = checkUserValid(req);
        const result = [];
        console.log('key',key);
        //如果key是数字，那么会优先认为是一个quiz id
        if (!isNaN(key)) {
            let quiz = await quizServ.findById(Number(key));
            result.push(quiz.dataValues);
        }
        //在问题或答案中寻找
        let someQuizs = await quizServ.findByQuestionOrAnswer({question:key,answer:key});
        if (someQuizs) {
            someQuizs.forEach(quiz=>{
                result.push(quiz.dataValues)
            })
        }
        //如果跟某个标签名相同，则返回该用户所有题库下的有关该标签的所有题目
        let tag = await tagServ.findByName(key);
        if (tag) {
            let records = await TagQuizs.findAll({
                where:{
                    tagId:tag.getDataValue('id'),
                    playerId:id
                }
            })
            records.forEach(async (record)=>{
                let data = record.dataValues;
                let quizId = data.quizId;
                let q = await quizServ.findById(quizId);
                result.push(q.dataValues);
            })
        }

        
        for (let i = 0; i < result.length; i++) {
            //找到每个quiz的tags封装进去
            let tags = await quizServ.getTags({id:result[i].id});
            result[i].tags = objfy(tags);
            //result中每个quiz的repoid需转换成对应repo名返回回去
            let repo = await repoServ.findById(result[i].repoId);
            result[i].repoName = repo.getDataValue('name');
        }

        res.json({data:result,status:200});
    } catch (error) {
        next(error);
    }
})


module.exports = router;
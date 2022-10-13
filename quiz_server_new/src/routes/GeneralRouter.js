const express = require("express");
const { checkUserValid } = require("../common");
const quizServ = require('../services/QuizService');
const remServ = require('../services/RemService');

const router = express.Router();

router.get('/general/level',async (req,res,next)=>{
    try {
        const playerId = checkUserValid(req);
        const data = [];
        const model = await quizServ.findAllSortedByLevel(playerId);
        for (let i = 0; i < model.length; i++) {
            data.push(model[i].dataValues);
        }
        res.json({
            data,
            status:200
        })
    } catch (error) {
        next(error)
    }
})

router.get('/general/repolevels',async (req,res,next)=>{
    try {
        const playerId = checkUserValid(req);
        const repoName = req.query['repoName'];
        console.log('repoName',repoName);
        const data = [];
        const model = await quizServ.findInRepoSortedByLevel(playerId,repoName);
        for (let i = 0; i < model.length; i++) {
            data.push(model[i].dataValues);
        }
        res.json({
            data,
            status:200
        })
    } catch (error) {
        next(error);
    }
})

router.get('/general/week',async (req,res,next)=>{
    try {
        const playerId = checkUserValid(req);
        let d = new Date();
        let curYear = d.getFullYear();
        let curMonth = d.getMonth()
        let curDate = d.getDate();

        let now = new Date();
        now.setFullYear(curYear);
        now.setMonth(curMonth);
        now.setDate(curDate);
        now.setHours(0);
        //选取00:05是因为，考虑到数据量多的情况下sql执行消耗时间较长
        //另一个点是，rem表执行周期是24小时，每00:01:00开始执行
        //如果我也选择这个时间点取当天内的背题数，那么会把昨天的背题数也计入，所以需要加几分钟
        now.setMinutes(5);
        now.setSeconds(0);

        const data = [];
        //const model = await remServ.getRemedInaDay(playerId,now);
        // console.log(model[0].dataValues);
        const oneDay = 1000 * 60 * 60 *24;
        for (let i = 0; i < 7; i++) {
            //调用getRemedInaDay，传入当前时间，其返回的是前一天的记忆数据，
            let model = await remServ.getRemedInaDay(playerId,now);
            //封装数据，放入data
            let t = new Date(now - oneDay);
            data.push({
                week:t.getDay(),
                count:model.length > 0 ? model[0].dataValues['quizCount'] : 0
            })
            //更新now
            now = now -oneDay;
        }

        res.json({
            data,
            status:200
        })
    } catch (error) {
        next(error);
    }
})

router.get('/general/month',async (req,res,next)=>{
    try {
        const playerId = checkUserValid(req);
        let d = new Date();
        let curYear = d.getFullYear();
        let curMonth = d.getMonth()
        let curDate = d.getDate();

        let now = new Date();
        now.setFullYear(curYear);
        now.setMonth(curMonth);
        now.setDate(curDate);
        now.setHours(0);
        now.setMinutes(5);
        now.setSeconds(0);
        
        const data = [];
        const oneDay = 1000 * 60 * 60 *24;
        for (let i = 0; i < 30; i++) {
            //调用getRemedInaDay，传入当前时间，其返回的是前一天的记忆数据，
            let model = await remServ.getRemedInaDay(playerId,now);
            //封装数据，放入data
            let t = new Date(now - oneDay);
            data.push({
                date:(t.getMonth()+1) + '/' + t.getDate(),
                count:model.length > 0 ? model[0].dataValues['quizCount'] : 0
            })
            //更新now
            now = now -oneDay;
        }

        res.json({
            data,
            status:200
        })
    } catch (error) {
        next(error);
    }
})

module.exports = router;
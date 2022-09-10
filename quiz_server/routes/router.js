// var bodyParser = require('body-parser')
var express = require("express");
const tagHelper = require("../SqlHelpers/TagHelper");
const quizHelper = require("../SqlHelpers/QuizHelper");
const playerHelper = require('../SqlHelpers/PlayerHelper')
const tools = require("../public/tools/index");
var jwt = require('jsonwebtoken');
const {secretKey} = require('../public/config/index')

var router = express.Router();

// var urlencodedParser = bodyParser.json();

router.post("/new", async function (req, res, next) {
  const body = req.body;
  //查看标签是否存在于标签表中，若不存在，则插入标签表
  console.log('body',body);
  const tags = req.body.tags;
  const allTags = await tagHelper.getAll();
  let allTagList = allTags.map((val) => {
    return val["name"];
  });
  //找tags里allTags没有的
  let newTags = tags.filter((val) => {
    return allTagList.every((elem) => {
      return elem != val;
    });
  });
  let insertId = 0;
  // console.log(newTags);
  try {
    newTags.forEach((element) => {
      tagHelper.insert(tools.uuid(16, 16), element);
    });
    body.tags = body.tags.join('|')
    console.log('into id',body.id);
    if(body.id == null || body.id == undefined || body.id == ''){
      insertId = await quizHelper.insert(body)
    }
    else{
      console.log('into update');
      quizHelper.update(body)
      insertId = body.id
    }
    res.status(200).json(insertId);
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = "server handle error";
    res.send("error");
  }
});

router.get("/alltags", async function (req, res, next) {
  try {
    console.log('auth',req.auth);
    const allTags = await tagHelper.getAll();
    const allTagList = allTags.map((val) => {
      return val["name"];
    });
    // console.log(allTagList);
    res.status(200).json(allTagList);
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = "server internal error";
    res.send("error");
  }
});

router.get('/quizs',async (req,res,next)=>{
  console.log('params',req.query);
  let params = req.query
  let data = null
  try {
    data = await quizHelper.selectByTag(params.tag,params.number)
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send('Error')
  }
})

router.get('/quiz',async (req,res,next)=>{
  const keyWord = req.query.keyword
  try {
    let data = null;
    let regex = /^[0-9]+$/;
    if (regex.test(keyWord)) {
      data = await quizHelper.selectById(keyWord)
    }
    else{
      data = await quizHelper.selectByKeyword(keyWord)
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
})

router.get('/chglevel',(req,res,next)=>{
  const params = req.query
  try {
    quizHelper.updateLevel(params)
    res.status(200).send('OK')
  } catch (error) {
    res.status(500).send('Error')
  }
})

router.get('/quizrem',async (req,res,next)=>{
  const id = req.query.id;
  try {
    const hasRem = await quizHelper.deleteById(id)
    if (hasRem) {
      res.send('OK')
    }else{
      res.send('delete err')
    }
  } catch (e) {
    console.error(e);
  }
})

router.post('/login',async (req,res,next)=>{  
  const username = req.body['name']
  const password = req.body['password']
  //在数据库中查找是否存在该用户名
  // const user = await playerHelper.findByName(username)
  // //若不存在，则在用户表插入该用户名和密码
  // if(user.length === 0){
  //   playerHelper.insert(username,password)
  // }
  // //若存在，则校验密码是否正确
  // else if(user.length === 1){
  //   if (user[0].password !== password) {
  //     return res.send({
  //       status: 200,
  //       message: '密码错误'
  //      })
  //   }
  // }
   const tokenStr = jwt.sign({username},secretKey,{expiresIn:'6h'})
   res.send({
    status: 200,
    message:'登录成功',
    token:tokenStr
   })
})

router.get('/test',(req,res,next)=>{
  console.log(req.body);
  res.json({msg:'OK'})
})

module.exports = router;

const express = require("express");
const app = express();
const path = require("path");
const tagServ = require("./services/TagService");
const playerServ = require("./services/PlayerService");
const repoServ = require("./services/RepoService");
const quizServ = require("./services/QuizService");
const playerRouter = require('./routes/PlayerRouter');

const port = 9000;
//解析 JSON 格式的请求体数据，有了这个就可以不用手动使用body-parser(它本身基于body-parser)
app.use(express.json());
//解析urlencode格式，形如a=1&b=2。false表示可以使用第三方库来解析querystring。
app.use(express.urlencoded({ extended: false }));
//加载静态资源
app.use(express.static(path.join(__dirname, "public")));
//允许跨域
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(playerRouter);

app.listen(port, () => {
  console.log(`[interview king] is listening on port ${port}`);
});

//test
// async function doSth(){
//    try {
//     let repo = await repoServ.findById(2)
//     let res = await repoServ.removeById(repo.getDataValue('id'))
//     console.log(res);
//    } catch (error) {
    
//    }
// }

// doSth().then(value=>{
//     console.log('dosth done',value);
// },err=>{
//     console.log('dosth err',err);
// })

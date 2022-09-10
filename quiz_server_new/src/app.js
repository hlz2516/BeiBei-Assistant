const express = require("express");
const app = express();
const path = require("path");
const tagServ = require("./services/TagService");
const playerServ = require("./services/PlayerService");
const repoServ = require("./services/RepoService");
const quizServ = require("./services/QuizService");
const playerRouter = require("./routes/PlayerRouter");
const repoRouter = require("./routes/RepoRouter");
const { expressjwt: jwt } = require("express-jwt");
const { secretKey } = require("./common/sec");

const port = 9000;
//解析 JSON 格式的请求体数据，有了这个就可以不用手动使用body-parser(它本身基于body-parser)
app.use(express.json());
//解析urlencode格式，形如a=1&b=2。false表示不能使用第三方库来解析querystring。
app.use(express.urlencoded({ extended: false }));
//加载静态资源
app.use(express.static(path.join(__dirname, "public")));
//每次请求过来时，自动找到请求头中的Authorization字段，取出jwt，指定secret和算法进行解析
//可以通过unless设置不需要身份认证的路由，就不会进行解析
//注意，只要配置成功了，expressJwt中间件会在req上挂载一个auth属性，也就是jwt解析出来的用户信息
//在使用postman测试时，除登录以外的路由，需要在header中添加Authorization字段，其值结构为Bearer + 空格 + jwt字符串
app.use(
  jwt({
    secret: secretKey,
    algorithms: ["HS256"],
  }).unless({ path: ["/login"] })
);
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
app.use(repoRouter);

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.name === 'UnauthorizedError') {
    return res.send({ status:401,msg:'invalid token'})
  }
 
  res.send({status:500,msg:'unknown error,please contact developer'})
});

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

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
var jwt = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");
var logger = require("morgan");
// var indexRouter = require('./routes/index');
// var usesRouter = require('./routes/user');
var router = require('./routes/router')
const {secretKey} = require('./public/config/index')

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
//每次请求过来时，自动找到请求头中的authorization字段，取出jwt，指定secret和算法进行解析
//可以通过unless设置不需要身份认证的路由，就不会进行解析
//注意，只要配置成功了，expressJwt中间件会在req上挂载一个user，也就是jwt解析出来的用户信息
//密码不要放入jwt字符串中，因为可以解密出来
// app.use('/my',usesRouter)
app.use('/api',jwt({
  secret:secretKey,
  algorithms: ["HS256"]
}).unless({path:[/\/login$/]}),router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.name === 'UnauthorizedError') {
    return res.send({ status:401,message:'invalid token'})
  }
 
  res.send({status:500,message:'未知错误，请联系开发者'})
});

module.exports = app;

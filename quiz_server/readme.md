# 项目说明

这里是interview-king-personal的后端部分，主要提供web-API接口和对数据的操作

## 运行quiz_server需要的环境和软件

1. node.js。本地检验方式：cmd输入node -v查看是否输出node版本号
2. MySql(默认)。你必须要有一个数据库来存放quiz_client发送来的数据，这个数据库你可以放在本地也可以放在你的私人服务器上。这里我选用的是MySql数据库，因此我从npm下载的也是mysql包，我没有用orm框架，所以是自己封装的数据操作方法(详情看/SqlHelpers里的内容)，所以如果你要更换成其他的数据库，请谨慎操作。

## 运行项目

1. 使用git bash，输入命令git clone git@github.com:hlz2516/interview-king-personal.git
2. 使用vscode打开项目，进入quiz_server，打开控制台窗口，输入npm install --save自动下载必要的依赖
3. 配置MySql数据库。连接你自己的MySql数据库，创建一个database，进入这个database，并使用quiz_server下的create.sql创建本项目需要的表。例：
    - mysql -u root -p(登录连接数据库，需输入密码)
    - create database interview;(建立数据库)
    - use interview;(进入数据库)
    - source xxx/xxx/xxx/create.sql(绝对路径)(建表)
4. 在quiz_server/public/config建立一个mysql_config.js文件，并写入以下内容

```javascript
const mysql = require('mysql')

//建立与mysql的连接
const db = mysql.createPool({
    host:'xxx.xxx.xxx.xxx', //你自己的数据库地址，如果是本地则写127.0.0.1或localhost，如果是远程服务器，则写远程服务器的ip地址
    user: 'xxx',  //数据库用户名，默认root
    password: 'xxxxxx',
    database: 'xxx',    //第三步建的数据库名，如果你是按我的例子做的话，名为interview
    timeout: 5000
})

module.exports = db;
```
5. 运行项目，在控制台输入node ./bin/www或者npm start

## 关于用户身份认证

因为该项目采用前后端分离的形式，所以采用JWT认证的方案(支持跨域)

因为后台没有做架构，扩展业务时发现与数据库交互比较困难。现在遇到的主要问题是，  
1. 对于事务类型的查询，目前只能原生手写，且无法复用
2. 查询出的数据是很原始的，我们需要对数据进行封装，再用于业务中
3. 在做数据操作时希望能获取插入或删除后受影响的那条记录


现在开始网上寻找解决方案    
第一种方案是，使用promise对mysql包提供的API进行封装。将对数据的操作方法(crud)封装成一个query函数，外部传入sql字符串和参数。
而事务也是同理，将事务封装成一个transaction函数，外部传入sql字符串数组和参数数组，字符串数组与参数数组是一一对应的关系。
这样设计的话，我会设计四层架构：  
- 第一层就是底部基础函数，包括query和transaction函数；
- 第二层就是根据业务分类对数据库操作(crud)的一些封装
- 第三层就是将数据库查询出来的结果进行处理，封装，成为业务层能用的数据
- 第四层就是业务层，书写每个路由里的业务逻辑
这种方案对于第一个问题，确实可以复用了，但sql语句，参数都要自己写，但对于目前的需求来说还是可以接受的
对于第三个问题，封装的方法会返回一个promise，如果sql执行成功会返回结果，不过我不确定能否得到那条受影响的记录（需验证）  
研究了下事务函数的封装，发现，是用Promise.all来实现多个sql语句的执行的，只要其中一个sql语句执行失败就rollback；
但我们知道，all方法传入的多个promise之间是没有同步关系的，也就是说，它们是并行执行的，那么显然，方案一不满足我们的要求，因此我们选用方案二。

第二种方案是，使用orm框架，目前看起来用的较多的是sequelize。  
但是我个人认为，现在的业务需求量还远远达不到要上orm框架的地步，现在就用的话有点用牛刀杀鸡的味道。
orm框架能很好地解决原生手写和复用的问题，但也不太确定在做插入和删除时能否返回受影响的那条数据（应该是可以的，开发者肯定考虑到了）
如果是orm框架，可以省略掉架构的基础层。
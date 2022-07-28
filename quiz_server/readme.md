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

**tips**:如果你要在本地运行quiz_server并且投入使用，那么事情将会变得有点麻烦，本人也不太推荐使用（不是不能用）这个面试工具，首先你要把本地MySql服务设置为自动启动，也就是说每次开机后要保证MySql服务是存在的；第二是当你想复习面试题时，必须先启动quiz_server，你可以把quiz_server创建一个快捷方式并放入win系统的startup目录(系统在开机时会自动启动这里面的程序)，但这样也许会导致开机速度变慢；你也可以用vbs写一个脚本来启动服务端，把这个脚本放到桌面，想要背题时双击一下即可。但无论怎样，都多了一步本地启动服务端的步骤，如果让我每次背题都先开服务端再开客户端，那么我是不愿意的，所以我不推荐把启动服务端的任务交给用户，但我能接受的是，把服务端扔到另一个服务器上，之后我只需要在本地打开客户端就行了，所以我推荐想使用这个小工具的用户自己搞一个vps(虚拟专用服务器)，这是一劳永逸的事情。

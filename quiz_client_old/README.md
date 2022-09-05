# quiz_client_old(基于vue2)

# 运行项目

1. npm install --save安装项目所需依赖
2. 找到src/config/request.js,将第9行线上环境的ip地址改为你自己的运行quiz_server的机器的ip地址
3. 如果本地运行，在控制台窗口输入npm run serve
4. 如果要线上运行，在控制台窗口输入npm run build，在quiz_client下会生成一个dist目录，将dist目录下的所有文件复制到quiz_server下的public目录下，重新启动quiz_server，在浏览器访问quiz_server所在的机器及端口。例如，我将quiz_server放置在我的私人服务器www.abc.test运行，且监听12345端口，那么在浏览器端，我输入www.abc.test:12345即可访问到项目。

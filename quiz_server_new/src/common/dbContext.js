const { Sequelize,DataTypes } = require("sequelize");
console.log('dbcontext created');
//dbContext 是指 Sequelize 的实例,它表示与一个数据库的连接
const dbContext = new Sequelize("interview_dev", "root", "Hlz19961211/", {
  host: "www.normal-hu.top",
  dialect: "mysql",
});

//测试连接
dbContext.authenticate().then(
  (value) => {
    console.log("Connection has been established successfully.", value);
  },
  (err) => {
    console.error("Unable to connect to the database:", err);
  }
);

module.exports = {
    dbContext,
    DataTypes
};

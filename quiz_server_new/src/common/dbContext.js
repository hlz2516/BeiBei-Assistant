const { Sequelize,DataTypes } = require("sequelize");
const dbConfig = require('./dbConfig');

console.log('dbcontext created');
//dbContext 是指 Sequelize 的实例,它表示与一个数据库的连接
const dbContext = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.db_type,
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

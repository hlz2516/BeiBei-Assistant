const { Sequelize,DataTypes,QueryTypes } = require("sequelize");
const dbConfig = require('./dbConfig');

console.log('dbcontext created');
//dbContext 是指 Sequelize 的实例,它表示与一个数据库的连接
const dbContext = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.db_type,
  dialectOptions: {
    multipleStatements: true
  }  
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

async function upload(repoId,code) {
  try {
    await dbContext.query('call upload(?,?);',
    {
      replacements:[repoId,code],
      type:QueryTypes.ROW
    })
    return 0;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

async function download(playerId,code) {
  try {
    await dbContext.query('call download(?,?);',
    {
      replacements:[playerId,code],
      type:QueryTypes.ROW
    })
    return 0;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

module.exports = {
    dbContext,
    DataTypes,
    upload,
    download
};

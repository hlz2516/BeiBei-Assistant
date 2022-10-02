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

async function findTagsName(quizId){
  try {
    const results =  await dbContext.query(`select t.name from tag t,tagquizs tq where
     t.id = tq.tagId and tq.quizId = ? and tq.destroy_time is null and t.destroy_time is null;`,
    {
      replacements:[quizId],
      type:QueryTypes.SELECT
    })
    return results;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

async function remCoreQuery(playerId,repoId,importance,level,limited,tag){
  try {
    let sqlStr = '';
    let results = null;
    // if (importance instanceof Array) {
      
    // }
    if (!tag) {
      sqlStr = `select * from quiz where repoId = ? and importance in (?) and level = ? and 
      destroy_time is null order by remCount asc limit ?`;
      results =  await dbContext.query(sqlStr,
        {
          replacements:[repoId,importance,level,limited],
          type:QueryTypes.SELECT
        })
    }
    else{
      sqlStr = `select * from quiz where repoId = ? and importance in (?) and level = ? and 
      id in (select tq.quizId from tagquizs tq,tag t where tq.tagId = t.id and t.name = ?
         and tq.playerId = ? and t.destroy_time is null) and destroy_time is null 
         order by remCount asc limit ?`;
      results =  await dbContext.query(sqlStr,
        {
          replacements:[repoId,importance,level,tag,playerId,limited],
          type:QueryTypes.SELECT
        })
    }
    
    return results;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

async function findQuizByLevel(playerId,level){
  try {
    const sqlStr = `select distinct q.* from quiz q,tagquizs tq where q.id = tq.quizId and 
    tq.playerId = ? and q.level = ? and q.destroy_time is null and tq.destroy_time is null`;
    const results = dbContext.query(sqlStr,{
      replacements:[playerId,level],
      type:QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error(error);
  }
}

async function findTagsByRepo(repoId){
  try {
    const sqlStr = `select distinct t.name from quiz q,tagquizs tq,tag t where
     q.Id = tq.quizId and q.repoId = ? and  tq.tagId = t.id and
     q.destroy_time is null and t.destroy_time is null and tq.destroy_time is null
    `;
    const results = dbContext.query(sqlStr,{
      replacements:[repoId],
      type:QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error(error);
  }
}

async function recordRemembered() {
  try {
    await dbContext.query('call recordRemembered();',
    {
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
    download,
    findTagsName,
    remCoreQuery,
    findQuizByLevel,
    findTagsByRepo,
    recordRemembered
};

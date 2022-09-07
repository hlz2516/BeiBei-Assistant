const db = require("../public/config/mysql_config");
const tools = require("../public/tools/index");
const quizHelper = require('./QuizHelper')

async function findByUserId(userid) {
    let res = [];
    let sqlStr = "select id,player_id,name from repo where player_id = ?";
    let getResult = function (err, result) {
      if (err) {
        console.log('repo:find by username err',err.message);
        return;
      }
      res = tools.deepCopy(result)
    };
  
    await new Promise((resolve) => {
      db.query(sqlStr, userid, getResult).on("end", function () {
        resolve();
      });
    });
    return res;
  }

  async function findById(id) {
    let res = [];
    let sqlStr = "select id,player_id,name from repo where id = ?";
    let getResult = function (err, result) {
      if (err) {
        console.log('repo:find by id err',err.message);
        return;
      }
      res = tools.deepCopy(result)
    };
  
    await new Promise((resolve) => {
      db.query(sqlStr, id, getResult).on("end", function () {
        resolve();
      });
    });
    return res;
  }

  function insert(userid,name) {
    let sqlStr = "insert into repo(player_id,name) values(?,?)";
    try {
      db.query(sqlStr, [userid,name], (err, results) => {
        if (err) {
          console.log('repo insert error',err.message);
          return;
        }
        if (results.affectedRows === 1) {
          console.log("insert 1 repo succeed");
        }
      });
      return 0;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  function remove(id) {
    //找到该题库所有的题目
    const quizs = quizHelper.selectByRepo(id)
    //因为删除一个题库会顺带删除题库内的所有题目，所以这里使用事务
    // db.beginTransaction((err)=>{
    //     if (err) throw err;
        
    // })
  }

  module.exports = {
    findById,
    findByUser,
    insert,
    // remove
  }
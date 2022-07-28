const db = require("../public/config/mysql_config");
const tools = require("../public/tools/index");

async function findByName(name) {
  let res = [];
  let sqlStr = "select id,name,password from player where name = ?";
  let getResult = function (err, result) {
    if (err) {
      console.log('find by name err',err.message);
      return;
    }
    res = result.concat();
  };

  await new Promise((resolve) => {
    db.query(sqlStr, name, getResult).on("end", function () {
      // all rows have been received
      resolve();
    });
  });
  console.log('res',res);
  return res;
}

async function findById(id) {
  let res = [];
  let sqlStr = "select id,name from player where id = ?";
  let getResult = function (err, result) {
    if (err) {
      console.log('find by id err',err.message);
      return;
    }
    res = result.concat();
  };

  await new Promise((resolve) => {
    db.query(sqlStr, id, getResult).on("end", function () {
      // all rows have been received
      resolve();
    });
  });

  return res;
}

function insert(name,password) {
  let sqlStr = "insert into player(id,name,password) values(?,?,?)";
  let playerId = tools.uuid(16, 16);
  try {
    db.query(sqlStr, [playerId, name,password], (err, results) => {
      if (err) {
        console.log('player insert error',err.message);
        return;
      }
      if (results.affectedRows === 1) {
        console.log("insert 1 player succeed");
      }
    });
    return playerId;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

module.exports = {
  findById,
  findByName,
  insert,
};

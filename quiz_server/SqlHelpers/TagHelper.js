const db = require("../public/config/mysql_config");

function insert(id, name) {
  const sqlStr = "insert into tag(id,name) values(?,?)";

  db.query(sqlStr, [id, name], (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    if (result.affectedRows === 1) {
      console.log("insert 1 tag succeed");
    }
  });
}

function update(id, name) {
  const sqlStr = "update tag set name=? where id = ?";

  db.query(sqlStr, [id, name], (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    if (result.affectedRows === 1) {
      console.log("update 1 tag succeed");
    }
  });
}

function deleteById(id) {
  const sqlStr = "delete from tag where id = ?";

  db.query(sqlStr, id, (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    if (result.affectedRows === 1) {
      console.log("delete 1 tag succeed");
    }
  });
}

function deleteByName(name) {
  const sqlStr = "delete from tag where name = ?";

  db.query(sqlStr, name.toLowerCase(), (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    if (result.affectedRows === 1) {
      console.log("delete 1 tag succeed");
    }
  });
}

async function getAll() {
  let res = [];
  const sqlStr = "select id,name from tag";

  let select = function (err, result) {
    if (err) {
      console.log(err.message);
      return;
    }
    res = result.concat();
    // console.log('已赋值');
  };

   //让promise与当前线程同步
  await new Promise((resolve)=>{
    db.query(sqlStr, select)
    .on('end', function() {
      // all rows have been received
      resolve()
    });
  })
//   console.log('外部执行');
  return res;
}

module.exports = {
  insert,
  update,
  deleteById,
  deleteByName,
  getAll
};

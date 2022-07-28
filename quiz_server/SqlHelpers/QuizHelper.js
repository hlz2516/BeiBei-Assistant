const db = require("../public/config/mysql_config");

async function insert(quiz) {
  if (JSON.stringify(quiz) == "{}") {
    console.warn("quiz is an empty object");
    return;
  }

  if (
    quiz.importance == null ||
    quiz.importance == undefined ||
    quiz.importance == ""
  ) {
    quiz.importance = "unknown";
  }
  //插入数据
  let sqlStr = `insert into quiz(question,answer,tags,importance,level_time)
       values(?,?,?,?,?)`;
  let id = 0;

  await new Promise((resolve)=>{
    db.query(
      sqlStr,
      [quiz.question, quiz.answer, quiz.tags, quiz.importance, quiz.level_time],
      (err, results) => {
        if (err) {
          console.log(err.message);
          return;
        }
        if (results.affectedRows === 1) {
          console.log("insert 1 quiz succeed");
          id = results.insertId;
        }
      }
    )
    .on('end',()=>{
      resolve()
    })
  })

  return id;
}

function updateLevel(params) {
  let sqlStr = "update quiz set level = ?,level_time= ? where id = ?";
  db.query(
    sqlStr,
    [params.level, params.level_time, params.id],
    (err, results) => {
      if (err) {
        console.log(err.message);
        return;
      }
      if (results.affectedRows === 1) {
        console.log("update 1 quiz succeed");
      }
    }
  );
}
//tag,nums必传
async function selectByTag(tag, nums) {
  let res = [];
  //10%已熟悉，50%已理解，剩余给未知
  let dispatchNum = [Math.floor(nums * 0.1), Math.floor(nums * 0.5), 0];
  let sum = dispatchNum.reduce((prev, cur) => {
    return prev + cur;
  }, 0);
  dispatchNum[2] = nums - sum;

  //已熟悉的，标签为tag的，按时间升序排序的，前dispatchNum[0]行的数据
  let sqlStr1 = `select * from quiz where tags like '%${tag}%' and level = 'familiar' 
   order by level_time limit ${dispatchNum[0]}`;
  //已理解的，标签为tag的，按时间升序排序的，前dispatchNum[1]行的数据
  let sqlStr2 = `select * from quiz where tags like '%${tag}%' and level = 'understand' 
  order by level_time limit ${dispatchNum[1]}`;

  //先查找已熟悉的和已理解的
  await new Promise((resolve) => {
    db.query(sqlStr1, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      res = res.concat(results);
    }).on("end", () => {
      resolve();
    });
  });

  await new Promise((resolve) => {
    db.query(sqlStr2, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      res = res.concat(results);
    }).on("end", () => {
      resolve();
    });
  });
  //考虑到用户刚开始时已熟悉的和已理解的题为0道，也就是说前两句sql查回的结果集为空，那么如果还是按照之前的
  //分配逻辑则返回的结果集数目会非常少，所以这里要做下处理
  //但如果查回的结果集是跟之前分配的比例是相同数目的话，就不需要处理
  if (res.length < sum) {
    dispatchNum[2] = nums - res.length;
  }

  //未知的，标签为tag的，按时间升序排序的，前dispatchNum[2]行的数据
  let sqlStr3 = `select * from quiz where tags like '%${tag}%' and level = 'unknown' 
  order by level_time limit ${dispatchNum[2]}`;

  //此时在查询一次未知的
  await new Promise((resolve) => {
    db.query(sqlStr3, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      res = res.concat(results);
    }).on("end", () => {
      resolve();
    });
  });
  // res.forEach((record) => {
  //   console.log("level", record.level);
  // });
  return res;
}

function update(quiz) {
  let sqlStr = `update quiz set question = ?,answer=?,tags=?,importance=?,level=?,
  level_time = ? where id = ?`;

  db.query(
    sqlStr,
    [
      quiz.question,
      quiz.answer,
      quiz.tags,
      quiz.importance,
      quiz.level,
      quiz.level_time,
      quiz.id,
    ],
    (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      if (results.affectedRows === 1) {
        console.log("update 1 quiz succeed");
      }
    }
  );
}

async function selectById(id) {  
  let res = []

  let sqlStr = 'select * from quiz where id = ?'
  await new Promise((resolve)=>{
    db.query(sqlStr,id,(err,results)=>{
      if (err) {
        console.error(err)
        return
      }
      res = res.concat(results)
    })
    .on('end',()=>{
      resolve()
    })
  })

  return res
}

module.exports = {
  insert,
  selectByTag,
  updateLevel,
  update,
  selectById
};

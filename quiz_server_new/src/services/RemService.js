const Rem = require("../daos/Rem");
const { Op, fn, col } = require("sequelize");
const moment = require("moment");

//传入的date形式："2018-06-14T07:01:30.000Z"，时间戳
//或Sat Oct 01 2022 17:40:48 GMT+0800 (中国标准时间)
//功能：获取输入日期的前一天到该日期所背过的题目数
//由于定时任务都在凌晨0时1分执行，所以统计的是昨天的背题数
async function getRemedInaDay(playerId, date) {
  try {
    let now = Date.parse(new Date(date));
    //在当前时间基础上往前走一天
    let oneDay = 1000 * 60 * 60 * 24;
    let lastDay = now - oneDay;
    // console.log("now", Date.parse(now));
    // console.log("lastDay", lastDay);
    //在rem表中找
    let model = await Rem.findAll({
      attributes: [[fn("COUNT", col("id")), "quizCount"]],
      where: {
        [Op.and]: [
          {
            record_time: {
              [Op.between]: [lastDay, now],
            },
          },
          {
            playerId,
          },
        ],
      },
    });
    //model是一个数组，需要取[0]后再取dataValues
    // console.log("model", model);
    return model;
  } catch (error) {
    console.error(`getRemedInaDay error,playerId:${playerId},date:${date}`);
    throw error;
  }
}

module.exports = {
  getRemedInaDay,
};

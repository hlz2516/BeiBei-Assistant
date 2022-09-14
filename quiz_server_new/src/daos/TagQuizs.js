const { dbContext, DataTypes } = require("../common/dbContext");
const {defineMaxId} = require('../common')
const Quiz = require("./Quiz");
const Tag = require("./Tag");


const TagQuizs = dbContext.define("tagquizs", {
  TagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag,
      key: "id",
    },
    unique:'tagQuizIndex'
  },
  QuizId: {
    type: DataTypes.INTEGER,
    references: {
      model: Quiz,
      key: "id",
    },
    unique:'tagQuizIndex'
  },
},
{
    tableName:'tagquizs',
    timestamps:true,
    deletedAt:'destroy_time',
    createdAt:false,
    updatedAt:false,
    //软删除必须设置
    paranoid: true
});

defineMaxId(TagQuizs)

module.exports = TagQuizs;

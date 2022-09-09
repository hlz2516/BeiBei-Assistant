const { dbContext, DataTypes } = require("../common/dbContext");
const {defineMaxId} = require('../common')
const Quiz = require("./Quiz");
const Tag = require("./Tag");


const TagQuizs = dbContext.define("tagquizs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag,
      key: "id",
    },
  },
  QuizId: {
    type: DataTypes.INTEGER,
    references: {
      model: Quiz,
      key: "id",
    },
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

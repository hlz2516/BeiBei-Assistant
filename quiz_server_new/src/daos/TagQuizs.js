const { dbContext, DataTypes } = require("../common/dbContext");
const {defineMaxId} = require('../common')
const Quiz = require("./Quiz");
const Tag = require("./Tag");
const Player = require("./Player");


const TagQuizs = dbContext.define("tagquizs", {
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag,
      key: "id",
    },
    unique:'tagQuizIndex'
  },
  quizId: {
    type: DataTypes.INTEGER,
    references: {
      model: Quiz,
      key: "id",
    },
    unique:'tagQuizIndex'
  },
  playerId:{
    type:DataTypes.INTEGER,
    references: {
      model: Player,
      key: "id",
    },
  }
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

module.exports = TagQuizs;

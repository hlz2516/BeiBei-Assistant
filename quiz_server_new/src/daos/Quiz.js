const { dbContext, DataTypes } = require("../common/dbContext");
const Repo = require("./Repo");
const Tag = require('./Tag');
const TagQuizs = require('./TagQuizs')
const {defineMaxId} = require('../common')

const Quiz = dbContext.define("quiz", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  repoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Repo,
      key: "id",
    },
  },
  question: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  references:{
    type:DataTypes.STRING(256),
    allowNull:true
  },
  importance: {
    type: DataTypes.STRING(16),
    defaultValue: "unknown",
  },
  level: {
    type: DataTypes.STRING(16),
    defaultValue: "unknown",
  },
  remCount: {
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  last_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
},
{
    tableName:'quiz',
    timestamps:true,
    createdAt:false,
    updatedAt:'last_time',
    deletedAt:'destroy_time',
    paranoid:true
});

defineMaxId(Quiz);


//一个标签可以有多个题目，一个题目可以有多个标签
Tag.belongsToMany(Quiz,{through:TagQuizs})
Quiz.belongsToMany(Tag,{through:TagQuizs})

module.exports = Quiz;

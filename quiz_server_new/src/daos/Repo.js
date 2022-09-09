const { dbContext, DataTypes } = require("../common/dbContext");
const Player = require("./Player");
const Quiz = require('./Quiz');
const {defineMaxId} = require('../common');

const Repo = dbContext.define("repo", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
},
{
    tableName:'repo',
    timestamps:true,
    createdAt:false,
    updatedAt:false,
    deletedAt:'destroy_time',
    paranoid:true
});

defineMaxId(Repo);

Player.hasMany(Repo);
Repo.belongsTo(Player, {
  foreignKey: {
    name:'playerId',
    type:DataTypes.INTEGER
  }
});

//一个题库有多个题目，一个题目属于一个题库
Repo.hasMany(Quiz);
Quiz.belongsTo(Repo, {
  foreignKey: {
    name:'repoId',
    type:DataTypes.INTEGER,
    allowNull:false
  }
});

module.exports = Repo;

const { dbContext, DataTypes } = require("../common/dbContext");
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
    timestamps:false
});

Quiz.belongsToMany(Tag, { through: TagQuizs });
Tag.belongsToMany(Quiz, { through: TagQuizs });

module.exports = TagQuizs;

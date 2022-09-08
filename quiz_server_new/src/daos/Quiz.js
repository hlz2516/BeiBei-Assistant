const { dbContext, DataTypes } = require("../common/dbContext");
const Repo = require("./Repo");

const Quiz = dbContext.define("quiz", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  repo_id: {
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
  importance: {
    type: DataTypes.STRING(16),
    defaultValue: "unknown",
  },
  level: {
    type: DataTypes.STRING(16),
    defaultValue: "unknown",
  },
  last_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
},
{
    tableName:'quiz',
    timestamps:false
});

Repo.hasMany(Quiz);
Quiz.belongsTo(Repo, {
  foreignKey: "repo_id",
});

module.exports = Quiz;

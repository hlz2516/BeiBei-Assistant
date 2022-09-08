const { dbContext, DataTypes } = require("../common/dbContext");
const Player = require("./Player");

const Repo = dbContext.define("repo", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  player_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Player,
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
},
{
    tableName:'repo',
    timestamps:false
});

Player.hasMany(Repo);
Repo.belongsTo(Player, {
  foreignKey: "player_id",
});

module.exports = Repo;

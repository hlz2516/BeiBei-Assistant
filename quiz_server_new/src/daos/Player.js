const { dbContext, DataTypes } = require("../common/dbContext");
const crypt = require("../common/sec");

const Player = dbContext.define(
  "player",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(36),
      allowNull: false,
      set(value) {
        this.setDataValue("password", crypt.md5Encrypt(value));
      },
      get() {
        return this.getDataValue("password");
      },
    },
  },
  //配置项
  {
    tableName: "player",
    timestamps: true,
    // 不想要 createdAt
    createdAt: false,
    updatedAt: false,
    //软删除必须设置
    paranoid: true,
    deletedAt: "destroy_time",
  }
);

Object.defineProperty(Player, "maxId", {
  async get() {
    return await this.max("id");
  },
});

module.exports = Player;

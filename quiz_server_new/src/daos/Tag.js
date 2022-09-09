const { dbContext, DataTypes } = require("../common/dbContext");
const {defineMaxId} = require('../common')

const Tag = dbContext.define("tag", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(16),
    unique: true,
    allowNull: false,
  }
},
{
    tableName:'tag',
    timestamps:true,
    deletedAt:'destroy_time',
    createdAt:false,
    updatedAt:false,
    //软删除必须设置
    paranoid: true
});

defineMaxId(Tag);

module.exports = Tag;

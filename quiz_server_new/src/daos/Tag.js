const { dbContext, DataTypes } = require("../common/dbContext");

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

Object.defineProperty(Tag,'maxId',{
    async get(){
        return await this.max('id');
    }
})

module.exports = Tag;

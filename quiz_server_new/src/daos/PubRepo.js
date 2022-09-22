const { dbContext, DataTypes } = require("../common/dbContext");
const {defineMaxId} = require('../common');

const PubRepo = dbContext.define('PubRepo',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    code:{
        type:DataTypes.STRING(6),
        unique:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING(32),
        allowNull:false
    },
    creator:{
        type:DataTypes.STRING(16),
        allowNull:false
    },
    download_time:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    create_time:{
        type:DataTypes.DATE,
        allowNull:false
    }
},
{
    tableName:'pub_repo',
    timestamps:true,
    createdAt:'create_time',
    updatedAt:false
})

defineMaxId(PubRepo);

module.exports = PubRepo;
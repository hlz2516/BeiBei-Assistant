const { dbContext, DataTypes } = require("../common/dbContext");
const {defineMaxId} = require('../common');
const Player = require("./Player");

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
        allowNull:false,
        references:{
            model:Player,
            key:'name'
        }
    },
    download_time:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    create_time:{
        type:DataTypes.DATE,
        allowNull:false
    },
    desc:{
        type:DataTypes.STRING(200),
        defaultValue:''
    }
},
{
    tableName:'pub_repo',
    timestamps:true,
    createdAt:'create_time',
    updatedAt:false
})

defineMaxId(PubRepo);

// PubRepo.belongsTo(Player,{
//     sourceKey:'creator',
//     foreignKey:'name'
// });
// Player.hasMany(PubRepo,{
//     sourceKey:'creator',
//     foreignKey:'name'
// });

module.exports = PubRepo;
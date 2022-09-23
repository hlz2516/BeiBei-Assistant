const { dbContext, DataTypes } = require("../common/dbContext");
const {defineMaxId} = require('../common');
const PubRepo = require('./PubRepo');
const Player = require("./Player");

const PubComment = dbContext.define('PubComment',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    code:{
        type:DataTypes.STRING(6),
        allowNull:false,
        references:{
            model:PubRepo,
            key:'code'
        }
    },
    commenter:{
        type:DataTypes.STRING(16),
        allowNull:false,
        references:{
            model:Player,
            key:'name'
        }
    },
    comment:{
        type:DataTypes.STRING(200),
        allowNull:false
    },
    create_time:{
        type:DataTypes.DATE,
        allowNull:false
    }
},{
    tableName:'pub_comment',
    timestamps:true,
    createdAt:'create_time',
    updatedAt:false
})

defineMaxId(PubComment);

PubRepo.hasMany(PubComment,{
    sourceKey:'code',
    foreignKey:'code'
});
PubComment.belongsTo(PubRepo,{
    sourceKey:'code',
    foreignKey:'code'
});

module.exports = PubComment;
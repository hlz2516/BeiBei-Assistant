const { dbContext, DataTypes } = require("../common/dbContext");
const {defineMaxId} = require('../common');
const PubRepo = require('./PubRepo');

const PubQuiz = dbContext.define('PubQuiz',{
    id:{
        type:DataTypes.BIGINT,
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
    question:{
        type:DataTypes.STRING(128),
        allowNull:false
    },
    answer:{
        type:DataTypes.STRING(2048),
        allowNull:false
    },
    importance:{
        type:DataTypes.STRING(16),
        defaultValue:'未知'
    },
    tags:{
        type:DataTypes.JSON
    }
},
{
    tableName:'pub_quiz',
    timestamps:false
})

defineMaxId(PubQuiz);

PubRepo.hasMany(PubQuiz,{
    sourceKey:'code',
    foreignKey:'code'
});
PubQuiz.belongsTo(PubRepo,{
    sourceKey:'code',
    foreignKey:'code'
});

module.exports = PubQuiz;
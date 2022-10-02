const { dbContext, DataTypes } = require("../common/dbContext");
const Player = require("./Player");
const Quiz = require('./Quiz');
const {defineMaxId} = require('../common');

const Rem = dbContext.define('Rem',{
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
    },
    playerId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Player,
            key:'id'
        }
    },
    quizId:{
        type:DataTypes.BIGINT,
        allowNull:false,
        references:{
            model:Quiz,
            key:'id'
        }
    },
    record_time:{
        type:DataTypes.DATE,
        allowNull:false
    }
},
{
    tableName:'remember_record',
    timestamps:true,
    updatedAt:false,
    createdAt:'record_time'
})

defineMaxId(Rem);

module.exports = Rem;
const Player = require('../daos/Player');
const {Op} = require('sequelize');
const encrypt = require('../common/sec')

async function findAll(){
    try {
        const players = await Player.findAll();
        if (players === null) {
            console.error(`no players`);
        } else {
            return players;
        }
    } catch (error) {
        console.log(`findAll err:${error}`);
    }
}

async function findById(id) {
    try {
        const player = await Player.findByPk(id);
        if (player === null) {
            console.error(`no player's id is ${id}`);
        } else {
            return player;
        }
    } catch (error) {
        console.log(`findById err:${error},id:${id}`);
    }
}

async function findByName(name) {
    try {
        const player = await Player.findOne({
            where:{
                name
            }
        })
        if (player === null) {
            console.error(`no player's name is ${name}`);
        } else {
            return player;
        }
    } catch (error) {
        console.log(`findByName err:${error},name:${name}`);
    }
}

async function insert(name,password){
    try {
        if(password.length < 6 || password.length > 15){
            const info = '密码长度必须在[6,15]之间';
            console.warn(info);
            return { info }
        }
        let regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(password)) {
            const info = '密码必须只能包含字母和数字'
            console.warn(info);
            return { info }
        }
        const maxId = await Player.maxId;
        const player = await Player.create({
            id:maxId+1,
            name,password
        })
        if (player === null) {
            throw new Error('create a new player error!')
        }
        return player;
    } catch (error) {
        console.error(`insert err:${error},name:${name},password:${password}`);
    }
}

async function removeByName(name){
    try {
        let player = await findByName(name);
        if (player === null) {
            return player;
        }
        return await player.destroy();
    } catch (error) {
        console.error(`remove err:${error},name:${name}`);
    }
}

async function removeById(id){
    try {
        let player = await findById(id);
        if (player === null) {
            return player;
        }
        return await player.destroy();
    } catch (error) {
        console.error(`remove err:${error},id:${id}`);
    }
}

async function updateName({id,name}){
    try {
        const effects = await Player.update({name},{
            where:{ id }
        })
        return effects;
    } catch (error) {
        console.error(`updateName err:${error},id:${id},name:${name}`);
    }
}

async function updatePassword({id,password}){
    try {
        const effects = await Player.update({password},{
            where:{ id }
        })
        return effects;
    } catch (error) {
        console.error(`updatePassword err:${error},id:${id},password:${password}`);
    }
}

async function checkPassword({id,password}){
    try {
        let player = await findById(id);
        if (player === null) {
            let info = `no player's id is ${id}`
            console.error(info);
            return { info }
        }
        player = JSON.parse(player);
        const encryptedPwd = encrypt.md5Encrypt(password)
        if (player.password === encryptedPwd) 
            return true
        else{
            return false
        }
            
    } catch (error) {
        console.error(`checkPassword err:${error},id:${id},password:${password}`);
    }
}

module.exports = {
    findAll,
    findById,
    findByName,
    insert,
    removeByName,
    removeById,
    updateName,
    updatePassword,
    checkPassword
}
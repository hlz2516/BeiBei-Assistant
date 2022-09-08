const Tag = require('../daos/Tag');
const {Op} = require('sequelize');
const {objfy} = require('../common')

async function findAll(){
    try {
        const tags = await Tag.findAll();
        if (tags === null) {
            console.error(`no tags`);
        } else {
            return objfy(tags);
        }
    } catch (error) {
        console.log(`findAll err:${error}`);
    }
}

async function findById(id) {
    try {
        const tag = await Tag.findByPk(id);
        if (tag === null) {
            console.error(`no tag's id is ${id}`);
        } else {
            return objfy(tag);
        }
    } catch (error) {
        console.log(`findTagById err:${error},id:${id}`);
    }
}

async function findByName(name) {
    try {
        const tag = await Tag.findOne({
            where:{
                name
            }
        });
        if (tag === null) {
            console.error(`no tag's name is ${name}`);
        } else {
            return objfy(tag);
        }
    } catch (error) {
        console.log(`findTagById err:${error},id:${id}`);
    }
}

async function insert(name){
    try {
        let newId = await Tag.maxId;
        const newTag = await Tag.create({
            id:newId+1,
            name
        })
        if (newTag === null) {
            throw new Error('create a new tag error!')
        }
        return objfy(newTag);
    } catch (error) {
        console.error(`insert err:${error},name:${name}`);
    }
}

async function remove(name){
    try {
        let tag = findByName(name);
        if (tag === null) {
            return;
        }
        tag = JSON.parse(tag);
        await Tag.destroy({
            where:{ name }
        })
        return tag;
    } catch (error) {
        console.error(`remove err:${error},name:${name}`);
    }
}

async function updateName({id,name}){
    try {
        const effects = await Tag.update({name},{
            where:{ id }
        })
        return effects;
    } catch (error) {
        console.error(`update err:${error},name:${name}`);
    }
}

//输入一个tag name，查询与这个tag相关的所有题目

module.exports = {
    findById,
    findByName,
    insert,
    remove,
    findAll,
    updateName
}
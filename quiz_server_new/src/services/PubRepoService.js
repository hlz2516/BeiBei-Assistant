const PubQuiz = require('../daos/PubQuiz');
const PubRepo = require('../daos/PubRepo');
const PubComment = require('../daos/PubComment');
const moment = require('moment');

async function findByCode(code) {  
    try {
        let pubRepo = await PubRepo.findOne({
            where:{
                code
            }
        });
        if (!pubRepo) {
            console.warn(`未找到code为${code}的公共题库`);
        }
        return pubRepo;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function findAll() {  
    try {
        const pubRepos = await PubRepo.findAll({
            include:PubQuiz
        });
        return pubRepos.map(repo=>{
            return repo.dataValues;
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function addComment(playerName,code,comment) {  
    try {
        const model = await PubComment.create({
            code,
            commenter:playerName,
            comment
        });
        if(!model){
            console.error(`addComment error!playerName:${playerName},code:${code},comment:${comment}`);
        }
        return model;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getComments(code) {  
    try {
        let repoModel = await PubRepo.findOne({
            where:{
                code
            }
        });
        let comments = await repoModel.getPubComments();
        comments = comments.map(model=>{
            return model.dataValues;
        })

        comments.sort((a,b)=>{
            let t1 = moment(a.create_time);
            let t2 = moment(b.create_time);
            //要返回一个正值或负值，不要返回true/false
            return t2.isAfter(t1) ? 1 : -1;
        })
        return comments;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    findAll,
    addComment,
    getComments
}
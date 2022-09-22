const PubQuiz = require('../daos/PubQuiz');
const PubRepo = require('../daos/PubRepo');

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
    }
}


module.exports = {
    findAll
}
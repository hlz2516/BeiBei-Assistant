const Repo = require("../daos/Repo.js");
const Quiz = require("../daos/Quiz");
const { Op } = require("sequelize");
const { dbContext } = require("../common/dbContext.js");

async function findAll() {
  try {
    const repos = await Repo.findAll();
    if (repos === null) {
      console.error("no repos");
    } else {
      return repos;
    }
  } catch (error) {
    console.log(`findAll err:${error}`);
    throw error;
  }
}

async function findById(id) {
  try {
    const repo = await Repo.findByPk(id);
    if (repo === null) {
      console.error(`no repo's id is ${id}`);
    } else {
      return repo;
    }
  } catch (error) {
    console.log(`findById err:${error},id:${id}`);
    throw error;
  }
}

async function findByName(name,playerId) {
  try {
    const repo = await Repo.findOne({
      where: {
        name,
        playerId
      },
    });
    if (repo === null) {
      console.error(`no repo's name is ${name}`);
    } else {
      return repo;
    }
  } catch (error) {
    console.log(`findByName err:${error},name:${name},playerId:${playerId}`);
    throw error;
  }
}

async function belongsTo({ id }) {
  try {
    let repo = await Repo.findByPk(id);
    let player = await repo.getPlayer();
    return player;
  } catch (error) {
    console.log(`find player that belongs to err:${error},id:${id}`);
    throw error;
  }
}

async function insert(name, playerId) {
  try {
    const maxId = await Repo.maxId;
    const repo = await Repo.create({
      id: maxId + 1,
      name,
      playerId,
    });
    if (repo === null) {
      throw new Error("create a new repo error!");
    }
    return repo;
  } catch (error) {
    console.error(`insert err:${error},name:${name},playerId:${playerId}`);
    throw error;
  }
}
//删除题库时，先删除题库内的所有题目，再删除本身
async function removeById(id) {
  try {
    let repo = await Repo.findAll({
      where: { id },
      //预加载，没办法，懒加载暂时有点问题
      include: Quiz,
    });
    if (repo === null) {
      return repo;
    }
    // console.log('get',repo[0].quizzes);
    let quizs = repo[0].quizzes;
    //事务处理
    const res = await dbContext.transaction(async (t) => {
      let quizEffects = 0;
      let quizsLen = quizs.length;
      for (let index = 0; index < quizsLen; index++) {
        await quizs[index].destroy({
          transaction: t,
        });
        quizEffects++;
      }
      const repo = await repo[0].destroy({
        transaction: t,
      });
      return {
        quizEffects,
        repo
      };
    });
    return res;
  } catch (error) {
    console.error(`remove err:${error},id:${id}`);
    throw error;
  }
}

async function removeByName(name) {
  try {
    const id = (await findByName(name)).getDataValue("id");
    return await removeById(id);
  } catch (error) {
    console.error(`remove err:${error},name:${name}`);
    throw error;
  }
}

async function updateName({ id, name }) {
  try {
    const effects = await Repo.update(
      { name },
      {
        where: { id },
      }
    );
    return effects;
  } catch (error) {
    console.error(`updateName err:${error},id:${id},name:${name}`);
    throw error;
  }
}

async function updateOrigin({id,origin}){
  try {
    const effects = await Repo.update(
      { origin },
      {
        where: { id },
      }
    );
    return effects;
  } catch (error) {
    console.error(`updateOrigin err:${error},id:${id},origin:${origin}`);
    throw error;
  }
}

async function getQuizs({id}){
  try {
    let repo = await Repo.findAll({
      where: { id },
      include: Quiz,
    });
    return repo[0].quizzes;
  } catch (error) {
    console.error(`getQuizs err:${error},id:${id}`);
    throw error;
  }
}

async function getQuizCount(id){
  try {
    let repo = await Repo.findAll({
      where: { id },
      include: Quiz,
    });
    return repo[0].quizzes.length;
  } catch (error) {
    console.error(`getQuizCount err:${error},id:${id}`);
    throw error;
  }
}

module.exports = {
  findAll,
  findById,
  findByName,
  belongsTo,
  insert,
  removeById,
  removeByName,
  updateName,
  updateOrigin,
  getQuizCount,
  getQuizs
};

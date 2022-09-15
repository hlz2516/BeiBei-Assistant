const Quiz = require("../daos/Quiz");
const TagQuizs = require('../daos/TagQuizs');
const {dbContext} = require('../common/dbContext')
const tagServ = require('./TagService');
const { Op } = require("sequelize");
const Tag = require("../daos/Tag");

async function findAll() {
  try {
    const quizs = await Quiz.findAll();
    if (quizs === null) {
      console.error("no quizs");
    } else {
      return quizs;
    }
  } catch (error) {
    console.log(`findAll err:${error}`);
  }
}

async function findById(id) {
  try {
    const quiz = await Quiz.findByPk(id);
    if (quiz === null) {
      console.error(`no quiz's id is ${id}`);
    } else {
      return quiz;
    }
  } catch (error) {
    console.log(`findById err:${error},id:${id}`);
  }
}

async function findByQuestionOrAnswer({ question, answer }) {
  try {
    const quizs = await Quiz.findAll({
      where: {
        [Op.or]: [
          {
            question: {
              [Op.like]: `${question?'%'+question+'%':''}`,
            },
          },
          {
            answer: {
              [Op.like]: `${answer?'%'+answer+'%':''}`,
            },
          },
        ],
      },
    });
    if (quizs === null) {
      console.error("no quiz's found");
    } else {
      return quizs;
    }
  } catch (error) {
    console.log(`find err:${error},question:${question}},answer:${answer}`);
  }
}

async function belongsTo({ id }) {
  try {
    const quiz = await Quiz.findByPk(id);
    return await quiz.getRepo();
  } catch (error) {
    console.log(`find repo that belongs to err:${error},id:${id}`);
  }
}

async function insert({ question, answer,references, importance, level },repoId,tags,playerId) {
  try {
    if (!importance) {
      importance = "unknown";
    }
    if (!level) {
      level = "unknown";
    }
    if (!references) {
      references = "";
    }
    const maxId = await Quiz.maxId;

    const res = await dbContext.transaction(async (t)=>{
      //检查每个tag是否都已存在数据库中，若不存在，则插入
      for (let i = 0; i < tags.length; i++) {
        let result = await tagServ.findByName(tags[i]);
          if (!result) {
              let tmpTag = await tagServ.insert(tags[i]);
              if (!tmpTag) {
                throw new Error('create tag error!');
              }
          }
      }
      //插入quiz表
      const quiz = await Quiz.create({
        id: maxId + 1,
        question,
        answer,
        importance,
        level,
        references,
        repoId
      },{transaction:t});
      if (quiz === null) {
        throw new Error("create a new quiz error!");
      }

      //把quiz跟tags进项关联，顺便插入user方便以后的查询
      const quizId = quiz.getDataValue('id');
      for (let i = 0; i < tags.length; i++) {
        let curTag = await tagServ.findByName(tags[i]);
        await TagQuizs.create({
          quizId,
          tagId:curTag.getDataValue('id'),
          playerId
        },{transaction:t})
      }

      return quiz;
    })

    return res;
  } catch (error) {
    console.error(`insert err:${error},question:${question}`);
  }
}

async function removeById(id) {
  try {
    let quiz = await findById(id);
    if (quiz === null) {
      return quiz;
    }
    return await quiz.destroy();
  } catch (error) {
    console.error(`remove err:${error},id:${id}`);
  }
}

async function update({ id, question, answer, importance, level }) {
  try {
    const effects = await Quiz.update(
      { question, answer, importance, level },
      {
        where: { id },
      }
    );
    return effects;
  } catch (error) {
    console.error(`update err:${error},id:${id}`);
  }
}

async function getTags({id}){
  try {
    let quiz = await Quiz.findAll({
      where:{id},
      include:{
        model:Tag
      }
    })
    return quiz[0].tags;
  } catch (error) {
    console.error(`getTags err:${error},id:${id}`);
  }
}

module.exports = {
  findAll,
  findById,
  findByQuestionOrAnswer,
  belongsTo,
  removeById,
  update,
  insert,
  getTags
};

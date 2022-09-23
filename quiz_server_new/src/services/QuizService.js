const Quiz = require("../daos/Quiz");
const TagQuizs = require("../daos/TagQuizs");
const { dbContext, findTagsName } = require("../common/dbContext");
const tagServ = require("./TagService");
const { Op } = require("sequelize");
const Tag = require("../daos/Tag");
const _ = require("loadsh");

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
    throw error;
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
    throw error;
  }
}

async function findByQuestionOrAnswer({ question, answer }) {
  try {
    const quizs = await Quiz.findAll({
      where: {
        [Op.or]: [
          {
            question: {
              [Op.like]: `${question ? "%" + question + "%" : ""}`,
            },
          },
          {
            answer: {
              [Op.like]: `${answer ? "%" + answer + "%" : ""}`,
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
    throw error;
  }
}

async function belongsTo({ id }) {
  try {
    const quiz = await Quiz.findByPk(id);
    return await quiz.getRepo();
  } catch (error) {
    console.log(`find repo that belongs to err:${error},id:${id}`);
    throw error;
  }
}

async function insert(
  { question, answer, references, importance, level },
  repoId,
  tags,
  playerId
) {
  try {
    if (!importance) {
      importance = "未知";
    }
    if (!level) {
      level = "未知";
    }
    if (!references) {
      references = "";
    }
    const maxId = await Quiz.maxId;

    const res = await dbContext.transaction(async (t) => {
      //检查每个tag是否都已存在数据库中，若不存在，则插入
      for (let i = 0; i < tags.length; i++) {
        let result = await tagServ.findByName(tags[i]);
        if (!result) {
          let tmpTag = await tagServ.insert(tags[i]);
          if (!tmpTag) {
            throw new Error("create tag error!");
          }
        }
      }
      //插入quiz表
      const quiz = await Quiz.create(
        {
          id: maxId + 1,
          question,
          answer,
          importance,
          level,
          references,
          repoId,
        },
        { transaction: t }
      );
      if (quiz === null) {
        throw new Error("create a new quiz error!");
      }

      //把quiz跟tags进项关联，顺便插入user方便以后的查询
      const quizId = quiz.getDataValue("id");
      for (let i = 0; i < tags.length; i++) {
        let curTag = await tagServ.findByName(tags[i]);
        await TagQuizs.create(
          {
            quizId,
            tagId: curTag.getDataValue("id"),
            playerId,
          },
          { transaction: t }
        );
      }

      return quiz;
    });

    return res;
  } catch (error) {
    console.error(`insert err:${error},question:${question}`);
    throw error;
  }
}

async function update(
  { id, question, answer, importance, level, references },
  repoId,
  tags,
  playerId
) {
  try {
    if (!importance) {
      importance = "未知";
    }
    if (!level) {
      level = "未知";
    }
    if (!references) {
      references = "";
    }

    const res = await dbContext.transaction(async (t) => {
      //检查每个tag是否都已存在数据库中，若不存在，则插入
      for (let i = 0; i < tags.length; i++) {
        let result = await tagServ.findByName(tags[i]);
        if (!result) {
          let tmpTag = await tagServ.insert(tags[i]);
          if (!tmpTag) {
            throw new Error("create tag error!");
          }
        }
      }

      const effects = await Quiz.update(
        { repoId, question, answer, importance, level, references },
        {
          where: { id },
          transaction: t,
        }
      );
      if (effects === 0) {
        throw new Error("update a quiz error!");
      }

      //tagquizs表返回与该问题相关的tags
      let tagsinDB = await findTagsName(id);
      //tagsinDB:[ { name: 'java' }, { name: 'C#' }, { name: 'php' } ]
      tagsinDB = tagsinDB.map((tag) => {
        return tag.name;
      });
      console.log('origin',tagsinDB);
      //求tags对tagsinDB的差集，即tags里有，tagsinDB里没有的元素
      //对这些标签在关联表中添加
      let diffsA = _.difference(tags, tagsinDB);
      // console.log('A',diffsA);
      for (let i = 0; i < diffsA.length; i++) {
        let thisTag = await tagServ.findByName(diffsA[i]);
        if (thisTag) {
          const newTagQuiz = await TagQuizs.create(
            {
              quizId: id,
              tagId: thisTag.getDataValue("id"),
              playerId
            },
            { transaction: t }
          );
          if (!newTagQuiz) {
            throw new Error("create tagquiz error");
          }
        }
      }
      //求tagsinDB对tags的差集，即tagsinDB里有，tags没有的元素
      //对这些元素在关联表里进行删除
      let diffsB = _.difference(tagsinDB, tags);
      console.log('B',diffsB);
      for (let i = 0; i < diffsB.length; i++) {
        let thisTag = await tagServ.findByName(diffsB[i]);
        if (thisTag) {
          const efts = await TagQuizs.destroy({
            where: {
              quizId: id,
              tagId: thisTag.getDataValue("id")
            },
            transaction:t
          });
          if (efts === 0) {
            throw new Error("delete tagquiz error");
          }
        }
      }
      return effects;
    });
    return res;
  } catch (error) {
    console.error(`update err:${error},id:${id}`);
    throw error;
  }
}

async function removeById(id) {
  try {
    let quiz = await findById(id);
    let res = dbContext.transaction(async (t)=>{
      //先删除tagquizs关联表的相关内容
      await TagQuizs.destroy({
        where:{
          quizId:id
        },
        transaction:t
      });
      //删除问题本身
      await quiz.destroy({
        transaction:t
      });
      return 0;
    })
    return res;
  } catch (error) {
    console.error(`remove err:${error},id:${id}`);
    throw error;
  }
}

async function getTags({ id }) {
  try {
    let quiz = await Quiz.findAll({
      where: { id },
      include: {
        model: Tag,
      },
    });
    return quiz[0].tags;
  } catch (error) {
    console.error(`getTags err:${error},id:${id}`);
    throw error;
  }
}

async function updateLevel({id,level}){
  try {
    let quiz = await Quiz.update({level},{
      where:{id}
    });
    if (!quiz) {
      console.error('update quiz level error');
    }
    return quiz;
  } catch (error) {
    console.error(`updateLevel err:${error},id:${id},level:${level}`);
    throw error;
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
  getTags,
  updateLevel
};

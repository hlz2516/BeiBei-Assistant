const Quiz = require("../daos/Quiz");
const { Op } = require("sequelize");

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

async function insert({ question, answer, importance, level },repoId) {
  try {
    const maxId = await Quiz.maxId;
    const quiz = await Quiz.create({
      id: maxId + 1,
      question,
      answer,
      importance,
      level,
      repoId
    });
    if (quiz === null) {
      throw new Error("create a new quiz error!");
    }
    return quiz;
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

module.exports = {
  findAll,
  findById,
  findByQuestionOrAnswer,
  belongsTo,
  removeById,
  update,
  insert
};

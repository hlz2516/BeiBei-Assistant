const Tag = require("../daos/Tag");
const { Op } = require("sequelize");

async function findAll() {
  try {
    const tags = await Tag.findAll();
    if (tags === null) {
      console.error(`no tags`);
    }
    return tags;
  } catch (error) {
    console.log(`findAll err:${error}`);
    throw error;
  }
}

async function findById(id) {
  try {
    const tag = await Tag.findByPk(id);
    if (tag === null) {
      console.error(`no tag's id is ${id}`);
    }
    return tag;
  } catch (error) {
    console.log(`findTagById err:${error},id:${id}`);
    throw error;
  }
}

async function findByName(name) {
  try {
    const tag = await Tag.findOne({
      where: {
        name,
      },
    });
    if (tag === null) {
      console.error(`no tag's name is ${name}`);
    }
    return tag;
  } catch (error) {
    console.log(`findTagById err:${error},id:${id}`);
    throw error;
  }
}

async function insert(name) {
  try {
    let maxId = await Tag.maxId;
    const newTag = await Tag.create({
      id: maxId + 1,
      name:name.toLowerCase(),
    });
    if (newTag === null) {
      throw new Error("create a new tag error!");
    }
    return newTag;
  } catch (error) {
    console.error(`insert err:${error},name:${name}`);
    throw error;
  }
}

async function remove(name) {
  try {
    let tag = await findByName(name);
    if (tag === null) {
      return tag;
    }
    return await tag.destroy();
  } catch (error) {
    console.error(`remove err:${error},name:${name}`);
    throw error;
  }
}

async function updateName({ id, name }) {
  try {
    const effects = await Tag.update(
      { name },
      {
        where: { id },
      }
    );
    return effects;
  } catch (error) {
    console.error(`update err:${error},name:${name}`);
    throw error;
  }
}

module.exports = {
  findById,
  findByName,
  insert,
  // remove,
  findAll,
  updateName,
};

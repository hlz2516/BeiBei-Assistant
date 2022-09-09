function objfy(obj){
    return JSON.parse(JSON.stringify(obj))
}

function defineMaxId(obj){
    Object.defineProperty(obj, "maxId", {
        async get() {
          return await this.max("id");
        },
      });
}

function getOrigin(type,obj){
  try {
      const origin = type.findByPk(obj.id);
      if (origin !== null) {
          return origin
      }
  } catch (error) {
      console.error(`get origin err:${error},id:${obj.id}`);
  }
}

module.exports = {
    objfy,
    defineMaxId,
    getOrigin
}
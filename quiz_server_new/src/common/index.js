function objfy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function defineMaxId(obj) {
  Object.defineProperty(obj, "maxId", {
    async get() {
      return await this.max("id");
    },
  });
}

function getOrigin(type, obj) {
  try {
    const origin = type.findByPk(obj.id);
    if (origin !== null) {
      return origin;
    }
  } catch (error) {
    console.error(`get origin err:${error},id:${obj.id}`);
  }
}

function randomString(len) {
  len = len || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (i = 0; i < len; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

function checkUserValid(req) {
  const id = req.auth.id;
  if (id < 1) {
    return new Error(`用户验证失败，id：${id}`);
  }
  return id;
}

module.exports = {
  objfy,
  defineMaxId,
  getOrigin,
  randomString,
  checkUserValid
};

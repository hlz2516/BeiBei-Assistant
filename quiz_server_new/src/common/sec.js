const crypto = require('crypto');

function md5Encrypt(content){
    const md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
}

module.exports = {
    md5Encrypt
}
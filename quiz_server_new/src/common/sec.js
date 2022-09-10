const crypto = require('crypto');

const secretKey = 'code is not everything *_*';

function md5Encrypt(content){
    const md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
}

module.exports = {
    md5Encrypt,
    secretKey
}
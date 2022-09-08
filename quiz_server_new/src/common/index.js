function objfy(obj){
    return JSON.parse(JSON.stringify(obj))
}

module.exports = {
    objfy
}
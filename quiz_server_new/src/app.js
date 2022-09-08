const tagServ = require('./services/TagService')
const playerServ = require('./services/PlayerService')


async function doSth(){
    try {
        const a = await tagServ.insert('spring');
        console.log('a',a.name);
    } catch (error) {
        console.error('test err',error);
    }
}

doSth().then(value=>{
    console.log('dosth done',value);
},err=>{
    console.log('dosth err',err);
})

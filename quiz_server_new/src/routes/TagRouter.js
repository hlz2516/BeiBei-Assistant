const express = require("express");
const tagServ = require('../services/TagService')
const router = express.Router();
const {checkUserValid} = require('../common')

router.get('/tags',async (req,res,next)=>{
    try {
        const tags = await tagServ.findAll();
        const tagsName = tags.map(tag=>{
            return tag.getDataValue('name');
        })

        res.json({
            tags:tagsName,
            status:200
        })
    } catch (error) {
        next(error);
    }
})

module.exports = router;
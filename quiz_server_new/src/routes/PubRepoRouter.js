const express = require("express");
const pubRepoServ = require('../services/PubRepoService');
const { checkUserValid } = require("../common");

const router = express.Router();

router.get('/pubrepos',async (req,res,next)=>{
    try {
        const pubRepos = await pubRepoServ.findAll();
        res.json({
            data:pubRepos,
            status:200
        });
    } catch (error) {
        next(error);
    }
})

module.exports = router;
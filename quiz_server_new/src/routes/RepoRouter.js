const express = require('express')

const router = express.Router();

router.post('/repo',(req,res,next)=>{
    console.log(req.body);
    res.json({msg:'ok'});
})

module.exports = router;
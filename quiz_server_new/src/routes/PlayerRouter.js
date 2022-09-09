const express = require('express')

const router = express.Router();

router.post('/login',(req,res,next)=>{
    console.log(req.body);
    res.json({msg:'ok'});
})

module.exports = router;
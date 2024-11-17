const express = require('express');
const {userAuth} = require('../config/middlewears/userMiddleWear');
const profileRouter = express.Router();


profileRouter.get('/profile',userAuth,async(req,res)=>{
    
    try{
        const user = req?.user;
        return res.send(user);
    }
    catch(error){
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = {profileRouter};
const express = require('express');
const {userAuth} = require('../config/middlewears/userMiddleWear');
const {User} = require('../modles/user');
const {ConnectionRequest} = require('../modles/connectionRequest');
const requresRouter = express.Router();

requresRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    ;
    const allowedStatus = ["intrested","ignored"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"Invalid status type",status});
    }
    const isUserPresent = await User.findById(toUserId)
    if(!isUserPresent){
        return res.status(404).send('User Not Found');
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
        ]
    });

    if (existingConnectionRequest) {
        return res.status(403).send('Request Already Present');
    }
    
    let connectionMessage = status==="intrested"?`connection request send successfully`:`suggestion is ignored`;
    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    });
    const data =await connectionRequest.save();
    return res.json({
        message:connectionMessage,
        data
    })

    }catch(error){
        return res.status(400).send(error.message);
    }
    

});
requresRouter.post('/request/review/:status/:toUseId',userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUseId;
        let status = req.params.status;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(401).send("Status not allowed");
        }
        const isUserPresent = User.findOne(toUserId);
        if(!isUserPresent){
            return res.status(404).send("User not found");
        }
        const allRequests = await ConnectionRequest.find();

        const connectionRequest  = await ConnectionRequest.findOne({
            fromUserId:toUserId,
            toUserId:fromUserId,
            status:"intrested",
        })
        if(!connectionRequest){
            return res.status(404).send("request not found");
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        return res.status(200).json(data);
    }
    catch(error){
        return res.status(400).send(error.message);
    }
})
module.exports = {requresRouter}
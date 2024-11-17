const express = require('express');
const { userAuth } = require('../config/middlewears/userMiddleWear');
const { User } = require('../modles/user');
const { ConnectionRequest } = require('../modles/connectionRequest');
const userRouter = express.Router();

const userInfo = "firstName lastName email gender";
userRouter.get('/User/requests/get', userAuth, async (req, res) => {
    const user = req.user;
    const userId = user._id;
    try {
        const connectionRequests = await ConnectionRequest.find({
            toUserId: userId,
            status: 'intrested'
        }).populate("fromUserId", userInfo);
        if (!connectionRequests || connectionRequests.length === 0) {
            return res.status(201).send("No data found");
        }

        const data = connectionRequests.map(row => row.fromUserId);
        console.log(connectionRequests);
        console.log(data);
        return res.json({ message: "connection requests fetched successfully", data: data });
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
});

userRouter.get('/User/connections/get', userAuth, async (req, res) => {
    const user = req.user;
    const userId = user._id;
    if (!userId) {
        return res.status(404).send("User Not Found");
    }
    try {
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId: userId,
                    status: 'accepted'
                },
                {
                    toUserId: userId,
                    status: 'accepted'
                }
            ]
        }).populate("fromUserId", userInfo);

        if (!connectionRequest || connectionRequest.length === 0) {
            return res.status(404).json({ message: "No connection request found" });
        }

        // Extract only `fromUserId` from the array
        const data = connectionRequest.map(row => row.fromUserId);


        return res.json({ message: "Connections fetched successfully", data: data });
    } catch (error) {
        return res.status(400).send(error.message);
    }
});
userRouter.get('/feed', userAuth, async (req, res) => {
   
    const user = req.user;
    console.log("inside feed api");
    const page = parseInt(req.query.page, 10) || 0; // Ensure proper numeric conversion
    const limits = parseInt(req.query.limits, 10) || 10; // Default limit is 10
    
    const userId = user._id;

    if (!userId) {
        return res.status(404).send("User ID is not found");
    }

    try {
        // Fetch existing connections
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: userId },
                { fromUserId: userId }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach(req => {
            hideUsersFromFeed.add(req.toUserId.toString());
            hideUsersFromFeed.add(req.fromUserId.toString());
        });

        // Fetch users excluding those in connections and self
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: userId } }
            ]
        })
            .skip(page * limits)
            .limit(limits)
            .select("firstName lastName email age gender nationality"); // Fetch only specific fields

        if (!users || users.length === 0) {
            return res.status(404).send("No users available for suggestion");
        }
        console.log(".................................................");
        console.log(users);
        const data = users.map(row => ({
            _id: row._id,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            age: row.age,
            gender: row.gender,
            nationality: row.nationality
        }));
        console.log(data);
        return res.json({
            message: "Users fetched successfully",
            data: data
        });
    } catch (error) {
        console.error("Error fetching feed:", error.message);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = { userRouter }
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database'); 
const jwt = require('jsonwebtoken');
const { User } = require('./modles/user');
const {validateSingUpData} = require('./utils/validation');
// const {userAuth} = require('./config/middlewears/userMiddleWear')


// routers 
const {authRouter} = require('./routes/auth');
const {profileRouter} = require('./routes/profile');
const {requresRouter} = require('./routes/request');
const {userRouter} = require('./routes/userRoute');

app.use(express.json()); // this is to convert the json to javascript object...
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requresRouter);
app.use("/",userRouter);

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

connectDB()
    .then(() => {
        app.listen(7777, () => {
            console.log('Listening on port 7777');
        });
    })
    .catch(err => {
        console.error('Failed to start server:', err);
    });

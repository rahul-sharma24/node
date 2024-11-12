const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database'); 
const jwt = require('jsonwebtoken');
const { User } = require('./modles/user');
const {validateSingUpData} = require('./utils/validation');
// const {userAuth} = require('./config/middlewears/userMiddleWear')
const {userAuth} = require('./config/middlewears/userMiddleWear');

app.use(express.json()); // this is to convert the json to javascript object...
app.use(cookieParser());

app.post('/signup', async (req, res) => {
    try {
        let validationResult = validateSingUpData(req.body); // Pass only req.body
        if (validationResult !== "true") {
            return res.status(400).send(validationResult);
        }
        
        const newUser = new User(req.body);
        await newUser.save();
        const token = jwt.sign({_id:user_id},"krishna");
        res.cookie('authToken',token);
        res.send('User saved successfully');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Failed to save user: ' + error.message);
    }
});
app.get('/profile',userAuth,async(req,res)=>{
    
    try{
        const user = req?.user;
        return res.send(user);
    }
    catch(error){
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
})
app.get('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || password !== user.password) {
            return res.status(401).send("Invalid Credentials");
        }

        // Convert `user` to a model instance if needed
        if (!(user instanceof User)) {
            user = new User(user.toObject());
        }

        // Generate the token
        const token = await user.getJWT();
        
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 24 * 3600000)
        });

        return res.send("Login Successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something Went Wrong");
    }
});

app.get('/user', async (req, res) => {
    try {
        const userEmail = req.body.email;
        console.log(userEmail);
        const user = await User.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).send("Data Not Found"); // `return` ends function here
        }

        return res.status(200).json(user); // Ensures no extra code runs
    } catch (error) {
        console.error(error);
        return res.status(400).send("Something went wrong"); // Again, `return` for clarity
    }
});
app.get('/feed',async(req,res)=>{
    try{
        const users = await User.find({});

        if(users.length===0){
            return res.status(404).send("No Data Found");
        }
        else{
            return res.status(200).json(users);
        }
    }
    catch(error){
        console.error(error);
        return res.status(400).send("Something went wrong"); // Again, `return` for clarity
    }
})

app.delete('/user',async(req,res)=>{
    try{

        const userId = req.body.userId;
        const result = await User.findByIdAndDelete(userId);
        console.log("..............");
        console.log(result);
        if(result){
            return res.status(200).send("User deleted Successfully");
        }
        else{
            return res.status(404).send("User Not Found");
        }
    }
    catch(error){
        return res.status(400).send("Something went wrong");
    }
});

app.patch('/user',async(req,res)=>{
    try{
        const allowedUpadates = ["skills"];
        // console.log(req);
        
        const userId = req.query?.userId;
        const data = req.body;
        console.log(Object.keys(data));
        const isUpadatePossible = Object.keys(data).every((k)=>{
           return allowedUpadates.includes(k);
        })
        if(!isUpadatePossible){
            return res.status(400).send("Upadate not allowed")
        }
        if(data?.skills.length>10){
            return  res.status(400).send("Skills should not be more then 10");
        }

        const result = await User.findByIdAndUpdate(userId,data,{ returnDocument: 'after',runValidators:true});
        if(result){
            return res.status(200).json(result);
        }
        else{
            return res.status(404).send("Data Not Found");
        }
    }
    catch(error){
        console.log(error);
        return res.status(400).send("Something Went Wrong",error?.message);
    }
})

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

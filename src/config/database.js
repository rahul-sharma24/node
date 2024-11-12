const mongoose = require('mongoose');
const uri = 'mongodb+srv://rahul2424:rahul2003@cluster0.bpqjd.mongodb.net/devTinder';

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Connection error:', error);
        throw error;
    }
}

module.exports = connectDB;

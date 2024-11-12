const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    firstName: { type: String,required:true,trim:true ,minLength:3,maxLength:20},
    lastName: { type: String ,trim:true},
    email: { type: String, unique: true, required: true ,lowercase:true,trim:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error ("Email  is not valid");
            }
        }
    },
    password: { type: String, required: true },
    age: { type: Number,min:14 },
    gender: { type: String,trim:true,lowercase:true,
        validate(val){
            if(!["male","female","other"].includes(val)){
                throw new Error("Gender is not valid");
            }
        }
     } ,
    nationality:{type:String,default:"Indian",trim:true},
    skills:{type:Array},
},{
    timestamps:true
});
userSchema.methods.getJWT = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, "krishna", { expiresIn: "24h" });
    return token;
};


const User = mongoose.model('User', userSchema);
module.exports = {User}
const validator = require('validator')
const validateSingUpData = (req)=>{
    const {firstName,lastName,email,password} = req;
    if(!firstName||!lastName){
        return "Name is not valid";
    }
    else if(firstName?.lenght<=2||firstName?.lenght>20){
        return "Name lenght should be between 3 to 20";
    }
    else if(!validator.isEmail(email)){
        return "Email is not correct";
    }
   return "true";
}

module.exports ={validateSingUpData};
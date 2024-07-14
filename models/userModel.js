const mongoose=require("mongoose")
const bcrypt = require('bcrypt');
require('dotenv').config();

//configuring the userScema
const userSchema=new mongoose.Schema({
    confirmPassword:{ type:String, required:true },
    email:{type:String, required:true, unique:true},
    username: {type: String, required: true, unique: true },
    password:{type:String, required:true },
    isAvatarImageSet: { type: Boolean, default: false, },
    avatarImage: {type: String, default: "", },
})

//before saving the details of any user we hashed the passeword
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){ return next(); }
    try {
    const saltRounds = parseInt(process.env.SALT, 10); // Ensure SALT is an integer
    this.password=await bcrypt.hash(this.password,saltRounds);
    next();
    }catch (error) {
        next(error);
      }

})

//when try to login we are checking from the hashed password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
 }
 
 module.exports = mongoose.model('Users', userSchema);
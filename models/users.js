const mongoose = require('mongoose')

// user schema
const userSchema = mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true}
})

// Model creation
const UserModel = mongoose.model("user",userSchema)

// exporting model
module.exports = UserModel
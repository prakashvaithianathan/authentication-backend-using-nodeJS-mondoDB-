const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        dropDups:true
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    }
})

const userModel = mongoose.model('users',userSchema);

module.exports = userModel
let {model,Schema} = require("mongoose");

let userSchema = new Schema({
    firstName:{
        required:true,
        type:String
    },
    lastName:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    projects:{
        type:[Schema.ObjectId]
    }
},{timestamps:true})
module.exports = model("User",userSchema)
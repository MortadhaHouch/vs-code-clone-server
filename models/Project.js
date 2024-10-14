let {model,Schema} = require("mongoose");
let projectSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    views:{
        type:Number,
        default:0
    },
    isPublic:{
        type:Boolean,
        default:true
    }
})
module.exports = model("Project",projectSchema)
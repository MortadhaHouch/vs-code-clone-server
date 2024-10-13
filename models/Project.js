let {model,Schema} = require("mongoose");
let projectSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
})
module.exports = model("Project",projectSchema)
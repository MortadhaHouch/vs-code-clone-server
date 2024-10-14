let {model,Schema} = require("mongoose");
let fileSchema = new Schema({
    path:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:false,
    }
})
module.exports = model("File",fileSchema)
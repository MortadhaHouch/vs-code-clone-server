let {model,Schema} = require("mongoose");
let commentSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        required: true
    },
    replies:{
        type:[Schema.Types.ObjectId],
    },
    content:{
        type:String,
        required: true
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    }
});
module.exports = model("Comment",commentSchema)
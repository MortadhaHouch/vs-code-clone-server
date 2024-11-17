let {model,Schema} = require("mongoose");
let feedbackSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        required: true
    },
    content:{
        type:String,
        required: true
    },
    likes:{
        type:Number,
        default: 0
    },
    dislikes:{
        type:Number,
        default: 0
    },
    comments:{
        type:[Schema.Types.ObjectId]
    }
},{
    timestamps: true,
});
module.exports = model("Feedback",feedbackSchema)
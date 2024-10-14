let {model,Schema} = require("mongoose");
let socialMediaSchema = new Schema({
    facebook:{
        type: String,
        required:false,
    },
    linkedin:{
        type: String,
        required:false,
    },
    instagram:{
        type: String,
        required:false,
    },
    codePen:{
        type: String,
        required:false,
    },
    twitter:{
        type: String,
        required:false,
    },
    reddit:{
        type: String,
        required:false,
    },
    github:{
        type: String,
        required:false,
    },
    behance:{
        type: String,
        required:false,
    },
    website:{
        type: String,
        required:false,
    },
    pinterest:{
        type: String,
        required:false,
    },
    discord:{
        type: String,
        required:false,
    },
    medium:{
        type: String,
        required:false,
    },
    stackOverflow:{
        type: String,
        required:false,
    }
},{
    timestamps: true,
});
module.exports = model("socialMediaSchema",socialMediaSchema);
let {model,Schema} = require("mongoose");
let bcrypt = require("bcrypt");
let userSchema = new Schema({
    firstName:{
        required:true,
        type:String
    },
    lastName:{
        required:true,
        type:String
    },
    avatar:{
        type:Schema.Types.ObjectId
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
        type:[Schema.Types.ObjectId]
    },
    feedbacks:{
        type:[Schema.Types.ObjectId]
    },
    comments:{
        type:[Schema.Types.ObjectId]
    },
    likedFeedbacks:{
        type:[Schema.Types.ObjectId]
    },
    dislikedFeedbacks:{
        type:[Schema.Types.ObjectId]
    },
    likedComments:{
        type:[Schema.Types.ObjectId]
    },
    dislikedComments:{
        type:[Schema.Types.ObjectId]
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    socialMediaLinks:{
        type:Schema.Types.ObjectId
    }
},{timestamps:true})
userSchema.pre("save",async function(){
    try {
        if(this.isNew || this.isModified("password")){
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(this.password,salt);
            this.password = hashedPassword;
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = model("User",userSchema)
let express = require('express');
let userRouter = express.Router();
let User = require("../models/User.js")
let bcrypt = require("bcrypt");
let File = require("../models/File")
require("dotenv").config();
let jwt = require("jsonwebtoken");
const SocialMedia = require('../models/SocialMedia.js');
userRouter.post("/login",async(req,res)=>{
    try {
        let {email,password} = req.body;
        let user = await User.findOne({email});
        if(user){
            let isMatch = await bcrypt.compare(password,user.password);
            if(isMatch){
                let userAvatar = await File.findById(user.avatar);
                user.isLoggedIn = true;
                await user.save();
                res.status(200).json({
                    isLoggedIn:true,
                    user:{
                        id:user._id,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        email:user.email,
                        avatar:userAvatar
                    }
                })
            }else{
                res.json({password_message:"Invalid password!! please try again"})
            }
        }else{
            res.json({email_message:"User with this email does not exist!!please verify your email or create an account if you don't have one"});
        }
    } catch (error) {
        console.log(error);
    }
})
userRouter.get("/profile",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            if(user){
                let userSocialMedia = await SocialMedia.findById(user.socialMediaLinks);
                res.status(200).json({
                    userSocialMedia
                })
            }else{
                res.status(401).json({user_error:"User does not exist!! please consider logging in or create an account if you don't have one"})
            }
        }else{
            res.status(401).json({auth_error:"User is not logged in!! please log in to access your profile"})
        }
    } catch (error) {
        console.log(error);
    }
})
userRouter.post("/signup",async(req,res)=>{
    try {
        let {email,password,firstName,lastName,avatar} = req.body;
        let user = await User.findOne({email});
        if(user){
            res.json({email_message:"User with this email already exists!! please try again with a different email"});
        }else{
            let userAvatar = await File.create({
                path:avatar
            });
            let newUser = await User.create({
                firstName,
                lastName,
                email,
                password,
                avatar:userAvatar._id
            });
            res.status(200).json({
                isLoggedIn:true,
                user:{
                    id:newUser._id,
                    firstName:newUser.firstName,
                    lastName:newUser.lastName,
                    email:newUser.email,
                    avatar:userAvatar.path
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
})
userRouter.put("/edit",async(req,res)=>{
    try {
        let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
        let user = await User.findOne({email});
        if(user){
            let {password,firstName,lastName,avatar} = req.body;
        }
    } catch (error) {
        console.log(error);
    }
})
userRouter.put("/logout",async(req,res)=>{
    
})
module.exports = userRouter;
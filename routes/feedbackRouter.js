let express = require('express');
const Feedback = require('../models/Feedback');
let feedbackRouter = express.Router();
let User = require('../models/User');
const File = require('../models/File');
let jwt = require("jsonwebtoken");
const Comment = require('../models/Comment');
require("dotenv").config()
feedbackRouter.get("/:p?",async(req,res)=>{
    try {
        let {p} = req.params;
        let feedbacks = [];
        let foundFeedbacks = await Feedback.find();
        if(p && !isNaN(Number(p))){
            for await (const item of foundFeedbacks.slice(Number(p)*10,Number(p)*10+10)) {
                let user = await User.findById(item.author);
                if(user){
                    let userAvatar = await File.findById(user.avatar);
                    feedbacks.push({
                        id:item._id,
                        content:item.content,
                        email:user.email,
                        name:`${user.firstName} ${user.lastName}`,
                        userAvatar:userAvatar.path,
                        likes:item.likes,
                        dislikes:item.dislikes,
                        createdAt:item.createdAt,
                        updatedAt:item.updatedAt,
                        commentsCount:item.comments.length
                    })
                }
            }
        }else{
            for await (const item of foundFeedbacks) {
                let user = await User.findById(item.author);
                if(user){
                    let userAvatar = await File.findById(user.avatar);
                    feedbacks.push({
                        id:item._id,
                        content:item.content,
                        email:user.email,
                        name:`${user.firstName} ${user.lastName}`,
                        userAvatar:userAvatar.path,
                        likes:item.likes,
                        dislikes:item.dislikes,
                        createdAt:item.createdAt,
                        updatedAt:item.updatedAt,
                        commentsCount:item.comments.length
                    })
                }
            }
        }
        res.status(200).json({feedbacks})
    } catch (error) {
        console.log(error);
    }
})
feedbackRouter.post("/add",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            if(user){
                let {content} = req.body;
                let feedback = await Feedback.create({
                    content,
                    author:user._id
                })
                user.feedbacks.push(feedback._id);
                await user.save();
                res.status(200).json({feedback})
            }else{
                res.status(401).json({user_error:"User does not exist!! please consider logging in or create an account if you don't have one"})
            }
        }else{
            res.status(401).json({error:"Unauthorized"})
        }
    } catch (error) {
        console.log(error);
    }
})
feedbackRouter.put("/edit/:id",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            if(user){
                let {content} = req.body;
                let feedback = await Feedback.findByIdAndUpdate(req.params.id,{content});
                res.status(200).json({feedback})
            }else{
                res.status(401).json({user_error:"User does not exist!! please consider logging in or create an account if you don't have one"})
            }
        }else{
            res.status(401).json({auth_error:"Unauthorized"})
        }
    } catch (error) {
        console.log(error);
    }
})
feedbackRouter.put("/like/:id",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            if(user){
                let {id} = req.params;
                let feedback = await Feedback.findById(id);
                if(user.likedFeedbacks.includes(feedback._id)){
                    user.likedFeedbacks.splice(user.likedFeedbacks.indexOf(feedback._id),1);
                    feedback.likes--;
                }else{
                    user.likedFeedbacks.push(feedback._id);
                    feedback.likes++;
                }
                if(user.dislikedFeedbacks.includes(feedback._id)){
                    user.dislikedFeedbacks.splice(user.dislikedFeedbacks.indexOf(feedback._id),1);
                    user.likedFeedbacks.push(feedback._id);
                    feedback.dislikes--;
                    feedback.likes++;
                }else{
                    user.likedFeedbacks.push(feedback._id);
                    feedback.likes++;
                }
                await feedback.save();
                await user.save();
                res.status(200).json({likes:feedback.likes,dislikes:feedback.dislikes});
            }else{
                res.status(401).json({user_error:"User does not exist!! please consider logging in or create an account if you don't have one"})
            }
        }else{
            res.status(401).json({auth_error:"You are not allowed to edit this resource"})
        }
    } catch (error) {
        console.log(error);
    }
})
feedbackRouter.put("/dislike/:id",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            if(email){
                let user = await User.findOne({email});
                if(user){
                    let {id} = req.params;
                    let feedback = await Feedback.findById(id);
                    if(user.dislikedFeedbacks.includes(feedback._id)){
                        user.dislikedFeedbacks.splice(user.dislikedFeedbacks.indexOf(feedback._id),1);
                        feedback.dislikes--;
                    }else{
                        user.dislikedFeedbacks.push(feedback._id);
                        feedback.dislikes++;
                    }
                    if(user.likedFeedbacks.includes(feedback._id)){
                        user.likedFeedbacks.splice(user.likedFeedbacks.indexOf(feedback._id),1);
                        user.dislikedFeedbacks.push(feedback._id);
                        feedback.likes--;
                        feedback.dislikes++;
                    }else{
                        user.dislikedFeedbacks.push(feedback._id);
                        feedback.dislikes++;
                    }
                    await feedback.save();
                    await user.save();
                    res.status(200).json({likes:feedback.likes,dislikes:feedback.dislikes});
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})
feedbackRouter.delete("/delete/:id",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            if(user){
                let feedback = await Feedback.findById(req.params.id);
                if(feedback && user.feedbacks.includes(feedback._id)){
                    for await (const item of feedback.comments) {
                        let comment = await Comment.findById(item);
                        if(comment){
                            let commentAuthor = await User.findById(comment.author);
                            if(commentAuthor){
                                commentAuthor.comments.splice(commentAuthor.comments.indexOf(comment._id),1);
                                await commentAuthor.save();
                                await Comment.findByIdAndDelete(item);
                            }
                        }
                    }
                    user.feedbacks.splice(user.feedbacks.indexOf(feedback._id),1);
                    await Feedback.findByIdAndDelete(feedback._id);
                    await user.save();
                    res.status(200).json({feedback})
                }else{
                    res.status(401).json({error:"You are not allowed to delete this resource"})
                }
            }else{
                res.status(401).json({user_error:"User does not exist!! please consider logging in or create an account if you don't have one"})
            }
        }else{
            res.status(401).json({auth_error:"Unauthorized"})
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = feedbackRouter;
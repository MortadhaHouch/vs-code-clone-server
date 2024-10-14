let express = require('express');
let commentRouter = express.Router();
let jwt = require("jsonwebtoken");
let Feedback = require("../models/Feedback")
let User = require("../models/User");
let Comment = require("../models/Comment");
let File = require("../models/File")
require("dotenv").config()
commentRouter.get("/:id/:p?",async(req,res)=>{
    try {
        let {id,p} = req.params;
        let foundFeedback = await Feedback.findById(id);
        if(foundFeedback){
            let comments = [];
            if(p && !isNaN(Number(p))){
                for await (const item of foundFeedback.comments.slice(Number(p)*10,Number(p)*10+10)) {
                    let comment = await Comment.findById(item);
                    if(comment){
                        let author = await User.findById(comment.author);
                        if(author){
                            let userAvatar = await File.findById(author.avatar);
                            comments.push({
                                id:comment._id,
                                content:comment.content,
                                likes:comment.likes,
                                dislikes:comment.dislikes,
                                replies:comment.replies.length,
                                userAvatar:userAvatar.path
                            })
                        }
                    }
                }
            }else{
                for await (const item of foundFeedback.comments) {
                    let comment = await Comment.findById(item);
                    if(comment){
                        let author = await User.findById(comment.author);
                        if(author){
                            let userAvatar = await File.findById(author.avatar);
                            comments.push({
                                id:comment._id,
                                content:comment.content,
                                likes:comment.likes,
                                dislikes:comment.dislikes,
                                replies:comment.replies.length,
                                userAvatar:userAvatar.path
                            })
                        }
                    }
                }
            }
            res.status(200).json({comments})
        }
    } catch (error) {
        console.log(error);
    }
})
commentRouter.post("/add",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email,id} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            let feedback = await Feedback.findById(id);
            if(user){
                if(feedback && user.feedbacks.includes(feedback._id)){
                    let {content} = req.body;
                    let comment = await Comment.create({
                        author:user._id,
                        content
                    })
                    feedback.comments.push(comment._id);
                    user.comments.push(comment._id);
                    await user.save();
                    await feedback.save();
                    res.status(201).json({comment});
                }else{
                    res.status(401).json({feedback_error:"You are not allowed to edit this resource."});
                }
            }else{
                res.status(401).json({user_error:"User not found"})
            }
        }else{
            res.status(401).json({auth_error:"You are not allowed to perform this action"})
        }
    } catch (error) {
        console.log(error);
    }
})
commentRouter.put("/edit/:id",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            if(user){
                let {id} = req.params;
                let foundComment = await Comment.findById(id);
                if(foundComment && foundComment.author.toString() === user._id.toString()){
                    let {content} = req.body;
                    foundComment.content = content;
                    await foundComment.save();
                    res.status(200).json({comment:foundComment});
                }else{
                    res.status(401).json({comment_error:"You are not allowed to edit this resource."});
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})
commentRouter.put("/like/:id",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            if(user){
                let {id} = req.params;
                let foundComment = await Comment.findById(id);
                if(foundComment){
                    if(user.comments.includes(foundComment._id)){
                        if(user.likedComments.includes(foundComment._id)){
                            user.likedComments.splice(user.likedComments.indexOf(foundComment._id), 1);
                            foundComment.likes--;
                        }else{
                            user.likedComments.push(foundComment._id);
                            foundComment.likes++;
                        }
                        if(user.dislikedComments.includes(foundComment._id)){
                            user.dislikedComments.splice(user.dislikedComments.indexOf(foundComment._id), 1);
                            user.likedComments.push(foundComment._id);
                            foundComment.dislikes--;
                            foundComment.likes++;
                        }else{
                            user.likedComments.push(foundComment._id);
                            foundComment.likes++;
                        }
                        await foundComment.save();
                        await user.save();
                        res.status(200).json({likes:foundComment.likes, dislikes:foundComment.dislikes});
                    }else{
                        res.status(401).json({auth_error:"You are not allowed to perform this action"})
                    }
                }else{
                    res.status(404).json({resource_error:"resource not found."});
                }
            }else{
                res.status(401).json({user_error:"user with these credentials does not exist please consider logging or create account if you don't have one"});
            }
        }else{
            res.status(401).json({auth_error:"You are not allowed to perform this action"})
        }
    } catch (error) {
        console.log(error);
    }
})
commentRouter.put("/dislike/:id",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            if(user){
                let {id} = req.params;
                let foundComment = await Comment.findById(id);
                if(foundComment){
                    if(user.comments.includes(foundComment._id)){
                        if(user.likedComments.includes(foundComment._id)){
                            user.dislikedComments.push(foundComment._id);
                            user.likedComments.splice(user.likedComments.indexOf(foundComment._id), 1);
                            foundComment.likes--;
                            foundComment.dislikes++;
                        }else{
                            user.dislikedComments.push(foundComment._id);
                            foundComment.dislikes++;
                        }
                        if(user.dislikedComments.includes(foundComment._id)){
                            user.dislikedComments.splice(user.dislikedComments.indexOf(foundComment._id), 1);
                            foundComment.dislikes--;
                        }else{
                            user.dislikedComments.push(foundComment._id);
                            foundComment.dislikes++;
                        }
                        await foundComment.save();
                        await user.save();
                        res.status(200).json({likes:foundComment.likes, dislikes:foundComment.dislikes});
                    }else{
                        res.status(401).json({auth_error:"You are not allowed to perform this action"})
                    }
                }else{
                    res.status(404).json({resource_error:"resource not found."});
                }
            }else{
                res.status(401).json({user_error:"user with these credentials does not exist please consider logging or create account if you don't have one"});
            }
        }else{
            res.status(401).json({auth_error:"You are not allowed to perform this action"})
        }
    } catch (error) {
        console.log(error);
    }
})
commentRouter.delete("/delete/:id",async(req,res)=>{
    try {
        if(req.cookies.auth_token){
            let {email} = jwt.verify(req.cookies.auth_token,process.env.SECRET_KEY);
            let user = await User.findOne({email});
            if(user){
                let {id} = req.body;
                let foundComment = await Comment.findById(id);
                if(foundComment && foundComment.author.toString() === user._id.toString()){
                    user.comments.splice(foundComment.comments.indexOf(foundComment._id), 1);
                    await Comment.findByIdAndDelete(foundComment._id);
                    res.json({message:"Comment deleted successfully."});
                }else{
                    res.status(401).json({comment_error:"You are not allowed to delete this resource."});
                }
            }else{
                res.json({user_error:"user with these credentials does not exist please consider logging or create account if you don't have one"});
            }
        }else{
            res.status(401).json({auth_error:"You are not allowed to perform this action"});
        }
    } catch (error) {
        console.log(error);
    }
})
module.exports = commentRouter;
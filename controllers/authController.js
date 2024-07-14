const express = require("express");
const User = require("../models/userModel");
const { validateRegisterData, userNameAndEmailExist, findUserWithLoginId,authMiddleware} = require("../middleware/authUtils");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {generateToken} = require("../JWT/token");


const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
    const { confirmPassword, email, username, password } = req.body;

        //clean the data
        try {
            await validateRegisterData({ confirmPassword, email, username, password });
          } catch (error) {
            return res.send({
              status: 400,
              message: "Data error",
              error: error,
            });
          }


    //check if email and username already exist

    try{
        await userNameAndEmailExist({ email, username });
        const user = new User({ confirmPassword, email, username, password });
        await user.save();
        const token=generateToken(user);
        // console.log(token);
        return res.send({
        status: 201,
        message: "Register successfull",
        user: user,
        token : token,
          });
    }
    catch (error) {
        return res.send({
          status: 500,
          message: "Database error",
          error: error,
        });
      }
});



//Login
AuthRouter.post("/login", async (req, res) => {
    const { loginId, password } = req.body;
  
    if (!loginId || !password)
      return res.send({
        status: 400,
        message: "Missing credentials",
      });
     
      //find the user from db
    try {
        const userDb = await findUserWithLoginId({ loginId });
        
        //compare the password
        const isMatched = await bcrypt.compare(password, userDb.password);
       
        if (!isMatched) {
          return res.send({
            status: 400,
            message: "Password doest not matched",
          });
        }
        const token=generateToken(userDb);
            return res.send({
            status: 200,
            message: "Login successfull",
            user:userDb,
            token:token,
          });
        } catch (error) {
          return res.send({
            status: 500,
            message: "Database error",
            error: error,
          });
        }
})


AuthRouter.get("/allusers/:id", async(req,res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
          "email",
          "username",
          "avatarImage",
          "_id",
        ]);
        return res.json(users);
      } catch (ex) {
        return res.status(500).json({ message: ex.message });
      }
})

AuthRouter.post("/setavatar/:id", async(req,res) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(
          userId,
          {
            isAvatarImageSet: true,
            avatarImage,
          },
          { new: true }
        );
        return res.json({
          isSet: userData.isAvatarImageSet,
          image: userData.avatarImage,
        });
      } catch (ex) {
        return res.status(500).json({ message: ex.message });
      }
})

AuthRouter.post("/logout/:id", async (req, res) => {
    try {
        if (!req.params.id) return res.json({ msg: "User id is required " });
        onlineUsers.delete(req.params.id);
        return res.status(200).send("User got logout");
      } catch (ex) {
        return res.status(500).send({ msg: ex.message });
      }
  });


module.exports = AuthRouter;

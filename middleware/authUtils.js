const User = require("../models/userModel");
require('dotenv').config();
const jwt = require('jsonwebtoken');


const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const validateRegisterData = ({ confirmPassword, email, username, password }) => {
    return new Promise((resolve, reject) => {
      if (!confirmPassword || !email || !username || !password) { reject("Missing user data");  }
      if (typeof email !== "string") reject("Email is not a string");
      if (typeof password !== "string") reject("password is not a string");
      if (typeof username !== "string") reject("username is not a string");
      if (typeof confirmPassword !== "string") reject("name is not a string");
      if (confirmPassword.length < 3 || confirmPassword.length > 50)  reject("Name length should be 3-50");
      if (username.length < 3 || username.length > 50)  reject("userame length should be 3-50");
      if (!validateEmail(email)) reject("Email format is incorrect.");
      resolve();
    });
  };

  const userNameAndEmailExist = ({ email, username }) =>{
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await User.findOne({ $or: [{ email }, { username }], });
        if (userExist && userExist.email === email) reject("Email already exist.");
        if (userExist && userExist.username === username)  reject("Username already exist.");
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const findUserWithLoginId = ({ loginId }) =>{
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await User.findOne({ $or: [{ email: loginId }, { username: loginId }], }).select("+password");//specifically instructs Mongoose to include the password field in the query results.
        if (!userDb) reject("User does not exist, please register first");
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
      try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token is not valid Bhai' });
    }
    };
  
  module.exports = { validateRegisterData, userNameAndEmailExist, findUserWithLoginId, authMiddleware};
const Message = require('../models/messageModel');
const express = require("express");
// const { authMiddleware} = require("../middleware/authUtils");



const MessageRouter = express.Router();

MessageRouter.post("/getmsg/", async(req,res) =>{
    try {
        const { from, to, isGroup, groupId ,username} = req.body;
    
        const messages = await Message.find({
          users: { $all: [from, to], },
        }).sort({ updatedAt: 1 });
    
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from ,
            message: msg.message.text,
          };
        });
        res.json(projectedMessages);
      } catch (ex) {
        res.status(500).json({ error: ex.message });
      }
})

MessageRouter.post("/addmsg/", async(req,res) =>{
    try {
        const { from, to, message,isGroup, groupId,username } = req.body;
        const data = await Message.create({
          message: { text: message },
          users: [from, to],
          sender: from,
        });
    
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
      } catch (ex) {
        res.status(500).json({ error: ex.message });
      }

})

module.exports = MessageRouter;
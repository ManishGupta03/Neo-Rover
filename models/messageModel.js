const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: { text: { type: String, required: true }, },
    users: Array,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users",  required: true, },
    isGroup: { type: Boolean, default: false },
    groupId: { type: String, default: null },
    username: { type: String},
    // createdAt: { type: Date, default: new Date().toLocaleTimeString() },
    timestamp:{type:String},

  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);


//
// socket.on("send-msg", (data) => {
//   const { to, from, username, msg, groupId } = data;
//   io.to(groupId).emit("msg-recieve", {
//     from,
//     username,
//     message: msg,
//     groupId,
//     fromSelf: false,
//   });

//   // Store the message in the database (example schema)
//   const message = new MessageModel({
//     from,
//     to,
//     username,
//     message: msg,
//     groupId,
//     isGroup: true,
//   });
//   message.save();
// });
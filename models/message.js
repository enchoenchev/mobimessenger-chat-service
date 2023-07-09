const mongoose = require("mongoose");
const validator = require("validator");

const messageSchema = new mongoose.Schema({
  sender_id: {
    type: String,
    required: [true, "Sender user ID is required."],
  },
  recipient_id: {
    type: String,
    required: [true, "Recipient user ID is required."],
  },
  content: {
    type: String,
    required: [true, "Message content is required."],
  },
  chat: { type: mongoose.Schema.ObjectId, ref: "Chat" },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);

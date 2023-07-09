const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  creator_id: {
    type: String,
    index: true,
    required: [true, "Creator user ID is required."],
  },
  participant_id: {
    type: String,
    index: true,
    required: [true, "Participant user ID is required."],
  },
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);

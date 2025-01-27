
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  reported: {
    type: Boolean,
    default: false,
  },
  delete_password: {
    type: String,
    required: true,
  },
});

const threadSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  bumped_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  reported: {
    type: Boolean,
    default: false,
  },
  delete_password: {
    type: String,
    required: true,
  },
  replies: [replySchema],
});

const Thread = mongoose.model("Thread", threadSchema);
const Reply = mongoose.model("Reply", replySchema);

const getThreadId = async (text = "test", delete_password = "test") => {
  let thread = await Thread.findOne({ text, delete_password });
  if (!thread) {
    thread = await Thread.create({
      board: "test",
      text,
      delete_password,
      replies: [],
    });
  }
  return thread;
};

const getReplyId = async (thread_id) => {
  let thread = await Thread.findById(thread_id);
  let reply = thread.replies.length > 0 ? thread.replies[0] : null;
  if (!reply) {
    reply = new Reply({
      text: "test",
      created_on: new Date(),
      reported: false,
      delete_password: "test",
    });
    thread.replies.push(reply);
    thread = await thread.save();
    reply = thread.replies[thread.replies.length - 1];
  }
  return reply;
};

module.exports = { Thread, Reply, getThreadId, getReplyId };

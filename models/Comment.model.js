const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    commentAuthor: {
      type: String,
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
    commentRating: {
      type: Number,
      required: true,
      default: 0,
    },
    commentAuthorId: {
      type: String,
    },
    comments: {
      type: Array,
      required: true,
      default: [],
    },
    likedBy: {
      type: Array,
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

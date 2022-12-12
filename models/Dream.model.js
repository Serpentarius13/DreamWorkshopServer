const mongoose = require("mongoose");

const dreamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    time: {
      type: String,
    },
    dreamName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
    },
    authorAvatar: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    likedBy: {
      type: Array,
      required: true,
      default: [],
    },
    isPrivate: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const dreamModel = mongoose.model("dream", dreamSchema);

module.exports = dreamModel;

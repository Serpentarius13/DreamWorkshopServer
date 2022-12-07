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
      type: String
    },
    comments: {
      type: Array
    }
  },
  { timestamps: true }
);

const dreamModel = mongoose.model("dream", dreamSchema);

module.exports = dreamModel;

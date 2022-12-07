const { AuthenticationError } = require("apollo-server-express");
const casual = require("casual");
const { default: mongoose } = require("mongoose");

module.exports = {
  getAll: async (parent, args, { models }) => {
    const allDreams = await models.Dream.find();
    return allDreams;
  },

  getOneDream: async (parent, { id }, { models }) => {
    try {
      const dream = await models.Dream.findOne({ _id: id }).populate('comments');

      dream.comments.sort((a, b) => b.commentTime - a.commentTime);

      await dream.save();


      return dream;
    } catch (err) {
      console.log(err);
      throw new Error("dream not found");
    }
  },

  sentence: () => {
    return casual.sentence;
  },

  getUserDreams: async (parent, args, { models, user }) => {
    if (!user) return null;
    const dreams = await models.Dream.find({
      authorId: user.id,
    });

    return dreams;
  },

  getUser: async (parent, args, { models, user }) => {
    console.log("GETTING USER", user);
    if (!user) throw new AuthenticationError("Not authenticated");

    const returningUser = await models.User.findOne({ _id: user.id });

    console.log(returningUser);

    return returningUser;
  },
};

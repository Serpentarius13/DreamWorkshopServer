const { AuthenticationError } = require("apollo-server-express");
const casual = require("casual");

module.exports = {
  getAll: async (parent, args, { models }) => {
    const allDreams = await models.Dream.find();
    return allDreams;
  },

  getOneDream: async (parent, { id }, { models }) => {
    try {
      console.log("DREAM");
      console.log(id);
      const dream = await models.Dream.findOne({ _id: id });

      dream.comments.sort((a, b) => b.commentTime - a.commentTime);
      await dream.save();

      return dream;
    } catch (err) {
      throw new Error("dream not found");
      console.log(err);
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
    if (!user) throw new AuthenticationError("Not authenticated");

    const returningUser = await models.User.findOne({ id: user.id });

    return returningUser;
  },
};

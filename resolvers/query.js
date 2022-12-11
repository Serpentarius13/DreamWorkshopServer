const { AuthenticationError } = require("apollo-server-express");
const casual = require("casual");
const { default: mongoose } = require("mongoose");

module.exports = {
  getAll: async (parent, args, { models }) => {
    const allDreams = await models.Dream.find({ isPrivate: false });
    return allDreams;
  },

  getOneDream: async (parent, { id }, { models }) => {
    try {
      const dream = await models.Dream.findOne({ _id: id }).populate({
        path: "comments",
        populate: {
          path: "comments",
          populate: {
            path: "comments",
            populate: {
              path: "comments",
              populate: {
                path: "comments",
                populate: {
                  path: "comments",
                  populate: {
                    path: "comments",
                    populate: {
                      path: "comments",
                      populate: {
                        path: "comments",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      await dream.save();

      return dream;
    } catch (err) {
      console.log(err);
      throw new Error("dream not found");
    }
  },

  sentence: () => {
    return casual.short_description;
  },

  getUserData: async (parent, args, { models, user }) => {
    try {
      if (!user) throw new Error("Not authenticated");
      const dreams = await models.Dream.find({
        authorId: user.id,
      });
      const comments = await models.Comment.find({
        commentAuthorId: user.id,
      });

      return { dreams, comments };
    } catch (err) {
      console.log(err);
      throw new Error("Error getting dreams");
    }
  },

  getUser: async (parent, args, { models, user }) => {
    console.log("GETTING USER", user);
    if (!user) throw new AuthenticationError("Not authenticated");

    const returningUser = await models.User.findOne({ _id: user.id });

    console.log(returningUser);

    return returningUser;
  },
};

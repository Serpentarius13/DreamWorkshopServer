const { AuthenticationError } = require("apollo-server-express");
const casual = require("casual");
const { default: mongoose, models } = require("mongoose");

module.exports = {
  getAll: async (parent, args, { models }) => {
    const allDreams = await models.Dream.find({ isPrivate: false });
    return allDreams;
  },

  getOneDream: async (parent, { id }, { models }) => {
    try {
      const dream = await models.Dream.findById(id).populate({
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

      const avatarId = dream.authorId;
      console.log(avatarId, "!");
      let { avatar } =
        avatarId.length > 0
          ? await models.User.findById(avatarId)
          : { avatar: "" };

      avatar = checkAvatar(avatar);

      dream.avatar = avatar;
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

      const rating = calculateRating(dreams, comments);

      console.log(rating);

      return { dreams, comments, rating };
    } catch (err) {
      console.log(err);
      throw new Error("Error getting dreams");
    }
  },
  getOtherUserData: async (parent, { id }, { models }) => {
    try {
      console.log(id, "!");
      const dreams = await models.Dream.find({
        authorId: id,
        isPrivate: false,
      });

      const comments = await models.Comment.find({ commentAuthorId: id });

      const rating = calculateRating(dreams, comments);
      const user = await models.User.findById(id);
      let { avatar, name } = user;

      avatar = checkAvatar(avatar);

      console.log(dreams, comments, rating, avatar, name);

      return { dreams, comments, rating, avatar, name };
    } catch (err) {
      console.log(err);
      throw new Error("No such user");
    }
  },
  getUser: async (parent, args, { models, user }) => {
    console.log("GETTING USER", user);
    if (!user) throw new AuthenticationError("Not authenticated");

    const returningUser = await models.User.findOne({ _id: user.id });

    returningUser.avatar = checkAvatar(returningUser.avatar);

    console.log(returningUser);

    return returningUser;
  },
};

const calculateRating = (dreams, comments) => {
  const dreamRating = dreams.reduce((tot, one) => (tot += one.rating), 0) || 0;
  const commentRating =
    comments.reduce((tot, one) => (tot += one.commentRating), 0) || 0;
  const rating = dreamRating + commentRating;
  return rating;
};

const checkAvatar = (avatar) => {
  if (avatar.length < 5) return "/defaultAvatar.png";
  else return avatar;
};

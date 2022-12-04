const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
require("dotenv").config();

module.exports = {
  signUp: async (parent, { email, username, password }, { models }) => {
    console.log(username);
    email = email.toLowerCase().trim();

    const hashed = await bcrypt.hash(password, 10);

    console.log(hashed, email, password, username);

    try {
      const user = await models.User.create({
        username,
        email,
        password: hashed,
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error("Error creating account");
    }
  },
  signIn: async (parent, { password, email, username }, { models }) => {
    if (email) email = email.toLowerCase().trim();

    const user = await models.User.findOne({
      $or: [{ email }, { password }],
    });

    if (!user) throw new AuthenticationError("Error verifying email/username");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AuthenticationError("Error verifying password");

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },

  newDream: async (parent, args, { models, user }) => {
    console.log(user);
    console.log(args);
    let { name, email, time, dreamName, description } = args;
    if (!name) name = null;
    if (!email) email = null;
    if (!time) time = null;

    const doc = await models.Dream.create({
      name,
      email,
      time,
      dreamName,
      description,
      authorId: user?.id || "",
    });
    console.log(doc, "DIC");

    return doc;
  },

  deleteDream: async (parent, { id }, { models, user }) => {
    await models.Dream.deleteById({
      id,
    });

    return true;
  },

  
};

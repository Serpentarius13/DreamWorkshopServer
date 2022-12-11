const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
require("dotenv").config();

const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");

module.exports = {
  signUp: async (parent, { email, name, password, avatar }, { models }) => {
    console.log(name);
    email = email.toLowerCase().trim();

    const hashed = await bcrypt.hash(password, 10);

    console.log(hashed, email, password, name);

    console.log(avatar);

    try {
      const user = await models.User.create({
        name,
        email,
        password: hashed,
        avatar,
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error("Error creating account");
    }
  },
  signIn: async (parent, { password, name }, { models }) => {
    try {
      console.log(password, name);
      const user = await models.User.findOne({ name });

      console.log(user);

      if (!user)
        throw new AuthenticationError("Error verifying email/username");
      const valid = await bcrypt.compare(password, user.password);
      console.log(valid);
      if (!valid) throw new AuthenticationError("Error verifying password");

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Error signing in");
    }
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

  sendEmail: async (
    parent,
    { name, message, email: fromEmail, id },
    { models }
  ) => {
    try {
      console.log(name, message, fromEmail, id);
      console.log("BOBBOB");

      const dream = await models.Dream.findOne({
        _id: id,
      });

      console.log(dream);

      const { dreamName, description, email } = dream;
      const transporter = nodemailer.createTransport({
        host: "smtp.elasticemail.com",
        port: 2525,
        secure: false,
        auth: {
          user: "dreamworkshop1313@gmail.com",
          pass: "9FAA875194C98F21ABEF02F69ECA6E7B5755",
        },
      });

      const MailOptions = {
        from: "dreamworkshop1313@gmail.com",
        to: email,
        subject: `Dream workshop - message from ${name}`,
        html: ` <h1> Hello, this is a message from Dream Workshop </h1> <p> It concerns your dream called <b> ${dreamName} </b> <br/> Dream text as follows: <br/> <p style="margin: 1.4rem 0"> ${description} </p> <br/> And the message is: <br/>  <p style="margin: 1.4rem 0"> ${message} </p> <br/> You can contact <b> ${name} </b> by his email <i> ${fromEmail} </i>. <br/> <b> Please, dont push any limits, be kind and gentle to your fellow user. </b>  <br/> <span style="font-size: 24px; color: #9775fa; font-weight: bold"> Dream workshop. </span>  Thanks for staying with us </p> `,
      };

      transporter.sendMail(MailOptions, (err, info) => {
        if (err) console.log(err);
        if (info) console.log(info.response);
      });

      return true;
    } catch (err) {
      return false;
    }
  },

  addCommentToDream: async (
    parent,
    { name, text, dreamId },
    { models, user }
  ) => {
    try {
      const dream = await models.Dream.findOne({ _id: dreamId });

      const comment = await models.Comment.create({
        commentAuthor: name,
        commentText: text,
        commentAuthorId: user?.id || "",
        commentParentDream: dreamId,
      });

      dream.comments.push(comment);

      await dream.save();

      return true;
    } catch (err) {
      throw new Error("Error adding comment");
    }
  },
  addCommentToComment: async (
    parent,
    { dreamId, id, text, name },
    { user, models }
  ) => {
    try {
      const comments = await models.Comment.findOne({ _id: id });
      const comment = await models.Comment.create({
        commentAuthor: name,
        commentText: text,
        commentAuthorId: user?.id || "",
        commentParentDream: dreamId,
      });
      comments.comments.push(comment);
      await comments.save();
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Error creating comment");
    }
  },
  likeClick: async (parent, { id, isDream }, { models, user }) => {
    try {
      if (!user) return false;
      const toLike = isDream
        ? await models.Dream.findOne({ _id: id })
        : await models.Comment.findOne({ _id: id });

      const { likedBy } = toLike;

      const userId = user.id;

      if (likedBy.includes(userId)) {
        toLike.likedBy.remove(userId);
        toLike.rating -= 1;
        toLike.commentRating -= 1;
      } else {
        toLike.likedBy.push(userId);
        toLike.rating += 1;
        toLike.commentRating += 1;
      }

      await toLike.save();

      console.log(id);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  deleteContent: async (parent, { isDream, id }, { models, user }) => {
    isDream
      ? await models.Dream.deleteOne({
          _id: id,
        })
      : await models.Comment.deleteOne({
          _id: id,
        });

    return true;
  },
  deleteAllContentOfUser: async (parent, { isDreams }, { models, user }) => {
    try {
      isDreams
        ? await models.Dream.deleteMany({ authorId: user.id })
        : await models.Comment.deleteMany({ authorId: user.id });

      return true;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
  setAllDreamsPrivate: async (parent, _, { models, user }) => {
    try {
      if (!user) throw new AuthenticationError("Not authenticated");

      console.log("Upd");
      const dreams = await models.Dream.find({ authorId: user.id });
      if (!dreams.length) return false;
      const isPrivate = dreams[0].isPrivate;
      await models.Dream.updateMany(
        {
          authorId: user.id,
        },
        { $set: { isPrivate: !isPrivate } }
      ).then((res) => console.log(res));
      return true;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};

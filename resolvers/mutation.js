const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
require("dotenv").config();

const nodemailer = require("nodemailer");

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
      comments: [],
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

  addCommentToDream: async (parent, { name, text, id }, { models }) => {
    try {
      const dream = await models.Dream.findOne({ _id: id });

      const comment = {
        commentAuthor: name,
        commentText: text,
        commentTime: new Date(),
        comments: [],
      };
      dream.comments.push(comment);

      
      await dream.save();

      return true;
    } catch (err) {
      throw new Error("Error adding comment");
    }
  },
};

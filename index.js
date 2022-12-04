const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

//////////////////////////////

const mongoose = require("mongoose");

const API_KEY = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const connect = async () => {
  try {
    console.log("start connecting");
    await mongoose.connect(API_KEY);
    console.log("connected");
  } catch (err) {
    console.log(err);
  }
};

connect();

//////////////////////////////

const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./apollo-schema/typeDefs");
const resolvers = require("./resolvers/res.js");

const models = require("./models/models");

/////

const jwt = require("jsonwebtoken");

const getUser = (token) => {
  if (token) {
    try {
      console.log("boba");
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
};

/////

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);

    console.log(user);
    return { models, user };
  },
});

server.start().then((c) => server.applyMiddleware({ app, path: "/" }));

/////////////////////////////

const helmet = require("helmet");

app.listen(port, () => {
  console.log(`listening at ${port}`);
});

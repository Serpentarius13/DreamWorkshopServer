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

const getUser = (req) => {
  if (req) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return null;
      if (typeof token !== "string") return null;
      if (token.length < 5) return null;
      const signature = jwt.verify(token, process.env.JWT_SECRET);

      if (!signature) return null;

      return signature;
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
    console.log(req.headers.authorization);

    return { models, user: getUser(req) };
  },
});

server.start().then((c) => server.applyMiddleware({ app, path: "/" }));

/////////////////////////////

const helmet = require("helmet");
const cors = require("cors");



app.listen(port, () => {
  console.log(`listening at ${port}`);
});

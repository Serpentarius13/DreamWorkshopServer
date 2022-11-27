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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { models };
  },
});

server.start().then((c) => server.applyMiddleware({ app, path: "/" }));

/////////////////////////////

const casual = require("casual");
const cors = require("cors");


app.listen(port, () => {
  console.log(`listening at ${port}`);
});

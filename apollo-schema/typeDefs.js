const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getAll: [Dream!]!
    getOneDream(id: ID!): Dream!
    sentence: String!
  }

  type Mutation {
    newDream(
      name: String
      email: String
      time: String
      dreamName: String
      description: String
    ): Dream!
  }

  type Dream {
    name: String
    email: String
    time: String
    _id: String

    dreamName: String!
    description: String!
  }
`;

module.exports = typeDefs;

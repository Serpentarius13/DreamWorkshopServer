const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getAll: [Dream!]!

    sentence: String!
    getUserDreams: [Dream]
    getUser: User
    getOneDream(id: ID): Dream!
  }

  type Mutation {
    newDream(
      name: String
      email: String
      time: String
      dreamName: String
      description: String
    ): Dream!
    deleteDream: Boolean

    signUp(username: String, email: String, password: String): String
    signIn(username: String, email: String, password: String): String
  }

  type Dream {
    name: String
    email: String
    time: String
    _id: String

    authorId: String

    dreamName: String!
    description: String!
  }

  type User {
    username: String!
    email: String!
    password: String
    _id: ID
  }
`;

module.exports = typeDefs;

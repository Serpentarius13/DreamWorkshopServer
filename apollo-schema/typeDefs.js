const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar DateTime
  type Query {
    getAll: [Dream!]!

    sentence: String!
    getUserDreams: [Dream]
    getUser: User
    getOneDream(id: String): Dream!
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
    sendEmail(name: String, email: String, message: String, id: String): Boolean

    addCommentToDream(name: String, text: String, id: String): Boolean
  }

  type Dream {
    name: String
    email: String
    time: String
    _id: String

    authorId: String

    dreamName: String!
    description: String!

    comments: [Comment]
  }

  type User {
    username: String!
    email: String!
    password: String
    _id: ID
  }

  type Comment {
    commentTime: String
    commentAuthor: String
    commentText: String

    comments: [String]!
  }
`;

module.exports = typeDefs;

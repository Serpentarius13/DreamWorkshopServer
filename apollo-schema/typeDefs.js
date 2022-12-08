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

    signUp(name: String, email: String, password: String): String
    signIn(name: String, password: String): String
    sendEmail(name: String, email: String, message: String, id: String): Boolean

    addCommentToDream(name: String, text: String, id: String): Boolean
    addCommentToComment(name: String, text: String, id: String): Boolean
    likeClick(id: String, isDream: Boolean): Boolean
  }

  type Dream {
    name: String
    email: String
    time: String
    _id: String

    authorId: String

    dreamName: String!
    description: String!

    likedBy: [String]!
    rating: Int

    comments: [Comment]
  }

  type User {
    name: String!
    email: String!
    password: String
    _id: ID
  }

  type Comment {
    createdAt: String
    commentAuthorId: String
    commentAuthor: String
    commentText: String
    commentRating: Int
    likedBy: [String]
    _id: String

    comments: [Comment]
  }

  fragment CommentFragment on Comment {
    commentRating
    commentAuthorId
    commentAuthor
    commentText
    createdAt
    likedBy
    _id
  }
`;

module.exports = typeDefs;

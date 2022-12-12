const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar DateTime
  type Query {
    getAll: [Dream!]!

    sentence: String!
    getUserData: UserData
    getUser: User
    getOneDream(id: String): Dream!
  }

  type UserData {
    dreams: [Dream]
    comments: [Comment]
  }

  type Mutation {
    newDream(
      name: String
      email: String
      time: String
      dreamName: String
      description: String
    ): Dream!
    deleteContent(id: String, isDream: Boolean): Boolean
    deleteAllContentOfUser(isDreams: Boolean): Boolean
    setAllDreamsPrivate: Boolean

    signUp(
      name: String
      email: String
      password: String
      avatar: String
    ): String
    signIn(name: String, password: String): String
    sendEmail(name: String, email: String, message: String, id: String): Boolean
    sendEmailMe(name: String, email: String, message: String): Boolean

    addCommentToDream(
      name: String
      text: String
      dreamId: String
      id: String
    ): Boolean
    addCommentToComment(
      name: String
      text: String
      dreamId: String
      id: String
    ): Boolean
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

    isPrivate: Boolean

    comments: [Comment]
  }

  type User {
    name: String!
    email: String!
    password: String
    _id: ID
    createdAt: String
    avatar: String
  }

  type Comment {
    createdAt: String
    commentAuthorId: String
    commentAuthor: String
    commentText: String
    commentRating: Int
    likedBy: [String]
    _id: String
    commentParentDream: String

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

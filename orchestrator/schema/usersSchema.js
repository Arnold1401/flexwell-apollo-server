const { gql } = require('apollo-server');
const axios = require('axios');
const { USER_URL } = require('../config/index');

const typeDefs = gql`
  type Message {
    message: String
  }

  type User {
    _id: String
    username: String
    email: String
  }

  type AccessToken {
    access_token: String
  }

  type Query {
    getUsers: [User]
    getUserById(_id: String!): User
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!): Message
    loginUser(email: String!, password: String!): AccessToken
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const response = await axios.get(`${USER_URL}`);
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch users');
      }
    },
    getUserById: async (_, { _id }) => {
      try {
        const response = await axios.get(`${USER_URL}/${_id}`);
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error(`Failed to fetch user with ID: ${_id}`);
      }
    },
  },
  Mutation: {
    registerUser: async (_, { username, email, password }) => {
      try {
        const response = await axios.post(`${USER_URL}/pub/register`, {
          username,
          email,
          password,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error('Failed to register user');
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const response = await axios.post(`${USER_URL}/pub/login`, {
          email,
          password,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error('Failed to login');
      }
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};

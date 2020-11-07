import { COLLECTIONS, EXPIRETIME, MESSAGES } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bycrypt from 'bcrypt';
import { findElements, findOneElement } from './../../lib/db-operations';
import UsersService from '../../services/users.service';

/*
  id: ID!
  name: String!
  lastName: String!
  email: String!
  password: String!
  registerDate: String!
  birthDay: String!
*/
const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, __, context) {
      return new UsersService(_,__, context).items();
    },

    async login(_, { email, password }, context) {
      return new UsersService(_,{user: {email, password}}, context).login();
    },
    me(_, __, { token }) {
      return new UsersService(_,__,{ token }).auth();
    }
  },
};

export default resolversUserQuery;
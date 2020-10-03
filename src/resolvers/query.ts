import { COLLECTIONS, EXPIRETIME, MESSAGES } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from '../lib/jwt';
import bycrypt from 'bcrypt';

/*
  id: ID!
  name: String!
  lastName: String!
  email: String!
  password: String!
  registerDate: String!
  birthDay: String!
*/
const resolversQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        return {
          status: true,
          message: 'User list loaded successfully',
          users: await db.collection(COLLECTIONS.USERS).find().toArray(),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: 'Could not load user list',
          users: [],
        };
      }
    },

    async login(_, { email, password }, { db }) {
      try {
        const user = await db
          .collection(COLLECTIONS.USERS)
          .findOne({ email });

        if (user === null) {
          return {
            status: false,
            message: 'user not found',
            token: null,
          };
        }

        const passwordCheck = bycrypt.compareSync(password, user.password);
        
        if( passwordCheck !== null ){
            delete user.password;
            delete user.registerDate;
            delete user.birthDay;
        }
        return {
          status: true,
          message:
            !passwordCheck
              ? 'Wrong email or password'
              : 'User successfully logged in',
          token: 
            !passwordCheck
            ? null
            : new JWT().sign({ user}, EXPIRETIME.H24) 
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: 'There was a mistake',
          token: null,
        };
      }
    },
    me(_, __, { token }) {
        console.log(token);
        let info = new JWT().verify(token);
        if( info === MESSAGES.TOKEN_VERIFICATION_FAILED ) {
            return {
                status: false,
                message: info,
                user: null
            };
        }
        return{
            status: true,
            message: 'Successfully authenticated user with token',
            user: Object.values(info)[0]
        }
        return;
    }
  },
};

export default resolversQuery;

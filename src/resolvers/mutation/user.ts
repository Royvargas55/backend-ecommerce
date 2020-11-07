import { assignDocumentId, findOneElement, insertOneElement } from './../../lib/db-operations';
import { COLLECTIONS } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import bycrypt from 'bcrypt';
import UsersService from '../../services/users.service';

const resolversUsersMutation: IResolvers = {
    Mutation: {
        async register(_, { user }, context){  
            return new UsersService(_, { user }, context).register();
        },
        async updateUser(_, { user }, context){  
            return new UsersService(_, { user }, context).modify();
        }
    },   
};

export default resolversUsersMutation;
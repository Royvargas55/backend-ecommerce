import { assignDocumentId, findOneElement, insertOneElement } from './../../lib/db-operations';
import { COLLECTIONS } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import bycrypt from 'bcrypt';
import UsersService from '../../services/users.service';

const resolversUsersMutation: IResolvers = {
    Mutation: {
        register(_, { user }, context){  
            return new UsersService(_, { user }, context).register();
        },
        updateUser(_, { user }, context){  
            return new UsersService(_, { user }, context).modify();
        },
        deleteUser(_, { id }, context){  
            console.log({ id });
            return new UsersService(_, { id }, context).delete();
        },
        blockUser(_, { id }, context){  
            console.log({ id });
            return new UsersService(_, { id }, context).block();
        }
    },   
};

export default resolversUsersMutation;
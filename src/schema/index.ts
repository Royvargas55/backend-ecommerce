import 'graphql-import-node';
import resolvers from './../resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';

import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
const { mergeTypeDefs } = require('@graphql-tools/merge');


const typesArray = loadFilesSync(path.join(`${__dirname}/**/*.graphql`));
const typeDefs = mergeTypeDefs(typesArray, { all: true});

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
        requireResolversForResolveType: false
    }
});

export default schema;




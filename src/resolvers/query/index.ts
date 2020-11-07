import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversProductsQuery from './product';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversProductsQuery,
    resolversGenreQuery
]);

export default queryResolvers;
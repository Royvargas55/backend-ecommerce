import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversProductsQuery from './product';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversProductsQuery,
    resolversGenreQuery,
    resolversTagQuery
]);

export default queryResolvers;
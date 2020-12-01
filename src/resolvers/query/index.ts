import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversShopProductsQuery from './shop-product';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversShopProductsQuery,
    resolversGenreQuery,
    resolversTagQuery
]);

export default queryResolvers;
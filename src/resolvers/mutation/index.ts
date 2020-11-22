import GMR from 'graphql-merge-resolvers';
import resolversMailMutation from './email';
import resolversGenreMutation from './genre';
import resolversTagMutation from './tag';
import resolversUsersMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUsersMutation,
    resolversGenreMutation,
    resolversTagMutation,
    resolversMailMutation
]);

export default mutationResolvers;
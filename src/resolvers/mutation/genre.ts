import { IResolvers } from 'graphql-tools';
import GenresService from '../../services/genres.service';

const resolversGenreMutation: IResolvers = {
    Mutation: { 
        addGenre(_,variables, context) {
            // Call service
            return new GenresService(_, variables, context).insert();
        },

        updateGenre(_, variables, context) {
            // Call service
            return new GenresService(_, variables, context).modify();
        },
        deleteGenre(_, variables, context) {
            // Call service
            return new GenresService(_, variables, context).delete();
        }
    }
};

export default resolversGenreMutation;
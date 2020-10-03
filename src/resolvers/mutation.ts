import { COLLECTIONS } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import bycrypt from 'bcrypt';

const resolversMutation: IResolvers = {
    Mutation: {
        async register(_, { user }, { db }){  
            //Comprobar existencia del usuario
            const userCheck = await db.collection(COLLECTIONS.USERS).
                findOne({email: user.email});
                
            if(userCheck !== null){
                return {
                    status: false,
                    message: `The email "${user.email}" is registered, you cannot use this email`,
                    user: null
                };
            }
            //Comprobar ultimo usuario registrado para asignar ID
            const lastUser = await db.collection(COLLECTIONS.USERS).
                                find().
                                limit(1).
                                sort({registerDate: -1}).toArray();
            if(lastUser.length === 0){
                user.id = 1;
            }else{
                user.id = lastUser[0].id + 1;
            }
            //Asignar la fecha en formato ISO en la propiedad registerDate
            user.registerDate = new Date().toISOString();
            //Encriptar password
            user.password = bycrypt.hashSync(user.password, 10);
            //Guardar el documento (registro) en la collecion
            return await db.
                collection(COLLECTIONS.USERS).
                insertOne(user).then(
                    async () => {
                        return {
                            status: true,
                            message: `The user with the email "${user.email}" was successfully registered`,
                            user
                        };
                    }
                ).catch((err: Error) => {
                    console.log(err.message);
                    return {
                        status: false,
                        message: `unexpected error`,
                        user: null
                    };
                });
        }
    }   
};

export default resolversMutation;
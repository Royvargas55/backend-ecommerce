import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { assignDocumentId, findOneElement } from '../lib/db-operations';
import bycrypt from 'bcrypt';
import ResolversOperationsService from './resolvers-operations.service';
import JWT from '../lib/jwt';

class UsersService extends ResolversOperationsService {
    private collection = COLLECTIONS.USERS;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    //Lista de usuarios
    async items(){
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        const result = await this.list(this.collection, 'Users', page, itemsPage);
        return {info: result.info, status: result.status, message: result.message, users: result.items};
    }
    //Autenticarnos
    async auth() {
        let info = new JWT().verify(this.getContext().token!);
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
        };
    }
    //Iniciar sesión
    async login() {
        try {
            const variables = this.getVariables().user;
            // const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
            const user = await findOneElement(this.getDb(), this.collection, { email: variables?.email });
    
            if (user === null) {
              return {
                status: false,
                message: 'user not found',
                token: null,
              };
            }
    
            const passwordCheck = bycrypt.compareSync(variables?.password, user.password);
            
            if( passwordCheck !== null ){
                delete user.password;
                delete user.registerDate;
                delete user.birthDay;
            }
            return {
              status: passwordCheck,
              message:
                !passwordCheck
                  ? 'Wrong email or password'
                  : 'User successfully logged in',
              token: 
                !passwordCheck
                ? null
                : new JWT().sign({ user}, EXPIRETIME.H24),
              user:
                !passwordCheck
                   ? null
                   : user,
            };
          } catch (error) {
            console.log(error);
            return {
              status: false,
              message: 'There was a mistake',
              token: null,
            };
          }
    }
    //Registrar usuarios
    async register( ) {
        const user = this.getVariables().user;
  
        // comprobar que user no es null
        if (user === null) {
          return {
            status: false,
            message: 'Undefined user',
            user: null
          };
        }
        if (user?.password === null || 
          user?.password === undefined ||
          user?.password === '') {
            return {
              status: false,
              message: 'Wrong password',
              user: null
            };
          }
        // Comprobar que el usuario no existe
        const userCheck = await findOneElement(this.getDb(), this.collection, {email: user?.email});
  
        if (userCheck !== null) {
          return {
            status: false,
            message: `Email ${user?.email} is already registered`,
            user: null
          };
        }
  
        // COmprobar el último usuario registrado para asignar ID
        user!.id = await assignDocumentId(this.getDb(), this.collection, { registerDate: -1 });
        // Asignar la fecha en formato ISO en la propiedad registerDate
        user!.registerDate = new Date().toISOString();
        // Encriptar password
        user!.password = bycrypt.hashSync(user!.password, 10);
  
        const result = await this.add(this.collection, user || {}, 'user');
        // Guardar el documento (registro) en la colección
        return {
          status: result.status,
          message: result.message,
          user: result.item
        };
      }

    // Modificar un usuario
    async modify() {
      const user = this.getVariables().user;
      // comprobar que user no es null
      if (user === null) {
          return {
          status: false,
          message: 'Undefined user',
          user: null
        };
      }
      const idNumber = user?.id as number;
      const filter = {id: parseInt(idNumber.toString()) };
      const result = await this.update(this.collection, filter, user || {}, 'user');
      return {
        status: result.status,
        message: result.message,
        user: result.item
      };
    }

      // Borrar el usuario seleccionado
    async delete() {
      const id = this.getVariables().id;        
      if (id === undefined) {
        return {
          status: false,
          message: 'Identificador del usuario no definido, procura definirlo para eliminar el usuario',
          user: null
        };
      }
      const result = await this.del(this.collection, { id } , 'user');
      return {
        status: result.status,
        message: result.message
      };
    }

    //Bloquear usuario
    async block() {
        const id = this.getVariables().id; 
        //const id = { id: parseInt(idNumber.toString())};
        
        if (!this.checkData(String(id) || '')) {
            return {
                status: false,
                message: 'ID user not specified',
                genre: null
            };
        }

        const result = await this.update(this.collection, { id }, { active: false }, 'user');
        return { 
            status: result.status, 
            message: result.message ? 'Has been successfully blocked' : 'It has not been blocked, check it'
        };
    }

    // check data
    private checkData(value: string) {
      return (value === '' || value === undefined) ? false : true;
  }
    
}

export default UsersService;
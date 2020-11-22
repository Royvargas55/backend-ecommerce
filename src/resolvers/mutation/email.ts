import bycrypt from 'bcrypt';
import { findOneElement, updateOneElement } from './../../lib/db-operations';
import { EXPIRETIME, MESSAGES, COLLECTIONS } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import { transport } from '../../config/mailer';
import JWT from '../../lib/jwt';
import UsersService from '../../services/users.service';
import MailService from '../../services/mail.service';
import PasswordService from '../../services/password.service';

const resolversMailMutation: IResolvers = {
  Mutation: {
    async sendEmail(_, { mail }) {
        console.log(mail);
      // Call service
      return new MailService().send(mail);
    },
    async activeUserEmail(_, { id, email }) {
        return new UsersService(_, {user: {id, email}}, {}).active();
    },
    async activeUserAction(_, { id, birthDay, password }, {token, db}) {
      // verificar token
      const verify = verifyToken(token, id);
        if (verify?.status === false) {   
        return {
          status: false,
          message: verify.message
        };
      }
      return new UsersService(_, { id, user: { birthDay, password } }, {token, db}).unblock(true);
    },
    async resetPassword(_, { email }, { db }) {
      return new PasswordService(_, { user: {email} }, { db }).sendMail();
    },
    async changePassword(_, {id, password}, {db, token}) {
      // Verificar token
      const verify = verifyToken(token, id);
      if (verify?.status === false) {   
        return {
          status: false,
          message: verify.message
        };
      }
      return new PasswordService(_, {user: {id, password}}, {db} ).change();
    }
  },
};

function verifyToken(token: string, id: string) {
  const checkToken = new JWT().verify(token);
      if( checkToken === MESSAGES.TOKEN_VERIFICATION_FAILED ) {
        return {
            status: false,
            message: 'The period to activate the user has expired, contact the administrator'
        };
      }
      // si el toekn es valido, asigna info
      const user =Object.values(checkToken)[0];
      if (user.id !== id) {
        return {
          status: false,
          message: 'The token does not correspond to the user'
        };
      }
}

export default resolversMailMutation;

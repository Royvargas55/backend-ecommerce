import bycrypt from 'bcrypt';
import { COLLECTIONS, EXPIRETIME } from "../config/constants";
import { IContextData } from "../interfaces/context-data.interface";
import { findOneElement } from "../lib/db-operations";
import JWT from "../lib/jwt";
import MailService from "./mail.service";
import ResolversOperationsService from "./resolvers-operations.service";

class PasswordService extends ResolversOperationsService {
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  async sendMail() {
    const email = this.getVariables().user?.email || '';
    if (email === undefined || email === '') {
      return {
        status: false,
        message: 'Invalid email',
      };
    }
    // Comprobar existencia de usuario
    const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, {
      email,
    });
    console.log(user);

    // Usuario indefinido
    if (user === null || user === undefined) {
      return {
        status: false,
        message: `User with email ${email} does not exist`,
      };
    }
    const newUser = {
      id: user.id,
      email,
    };
    const token = new JWT().sign({ user: newUser }, EXPIRETIME.M15);
    const html = `Para cambiar la contraseña dirígete a este link: <a href="${process.env.CLIENT_URL}/#/reset/${token}">Click aquí</a>`;
    const mail = {
      to: email,
      subject: 'Petición para cambiar de contraseña',
      html,
    };
    return new MailService().send(mail);
  }

  async change() {
      const id = this.getVariables().user?.id;
      let password = this.getVariables().user?.password;
      // Verificar ID
      if (id === undefined || id === null) {
        return {
          status: false,
          message: 'The ID needs correct information'
        };
      }
      // Verificar password
      if (password === undefined || password === '' || password === '1234') {
        return {
          status: false,
          message: 'The password needs correct information'
        };
      }
      // Encriptar password
      password = bycrypt.hashSync(password, 10);
      // Actualizar en el ID seleccionado
      const result = await this.update(COLLECTIONS.USERS, { id }, { password }, 'users');
      return {
          status: result.status,
          message: (result.status) ? 'The password has been changed' : result.message,
      };
  }
}

export default PasswordService;

import { injectable } from "inversify";

@injectable()
export class PasswordHashingService {
  public hash(passWord: string): string {
    var bcrypt = require("bcrypt");
    return bcrypt.hashSync(passWord, 10);
  }

  public isValid(plainTextPassword: string, hashedPassword: string): boolean {
    var bcrypt = require("bcrypt");
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
  }
}

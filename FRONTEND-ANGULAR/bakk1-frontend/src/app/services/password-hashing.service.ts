import { Injectable } from '@angular/core';
declare var require: any;

@Injectable()
export class PasswordHashingService {
  public hash(passWord: string): string {
    var bcrypt = require('bcryptjs');
    return bcrypt.hashSync(passWord, 10);
  }

  public isValid(plainTextPassword: string, hashedPassword: string): boolean {
    var bcrypt = require('bcryptjs');
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
  }
}

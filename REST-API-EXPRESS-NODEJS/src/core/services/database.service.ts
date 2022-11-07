import { inject, injectable } from "inversify";
import { LoggerService } from "./logger.service";
import * as databaseConfiguration from "../../configuration/database-config.json";
import { User } from "../../models/user.model";
import { resolve } from "path";

@injectable()
export class DatabaseService {
  constructor(
    @inject(LoggerService.name) private loggerService: LoggerService
  ) {}

  public async initialize(): Promise<boolean> {
    var created = await this.createTables();

    if (created) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  public async insertUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
      insert into users (username, password, email, creationdt) values ('${
        user.username
      }', '${user.password}', '${
        user.email
      }', to_timestamp(${user.creationdt.valueOf()}/1000.0));`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject(res);
            }

            resolve(user);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while inserting new account");
          reject(user);
        });
    });
  }

  public async getUserByUserName(username: string): Promise<Array<User>> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
       select * from users where username = '${username}';`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject(username);
            }

            resolve(res.rows);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while extracting the user");
          reject(username);
        });
    });
  }

  public async getUsers(username: string, email: string): Promise<Array<User>> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
       select * from users where username = '${username}' or email = '${email}';`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject(username);
            }

            resolve(res.rows);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while extracting the user");
          reject(username);
        });
    });
  }

  public async getUserByEmail(email: string): Promise<Array<User>> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
       select * from users where email = '${email}';`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject(email);
            }

            resolve(res.rows);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while extracting the user");
          reject(email);
        });
    });
  }

  public async updateUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
      update users set username = '${user.username}', password = '${user.password}', email = '${user.email}' where id = ${user.id};`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject(user);
            }

            resolve(user);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while updating the user");
          reject(user);
        });
    });
  }

  public async deleteUserById(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `delete from users where id = ${id};`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject(id);
            }

            resolve(true);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while deleting the user");
          reject(id);
        });
    });
  }

  public async getUserById(id: string): Promise<Array<User>> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
      select * from users where id = ${id};`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject(id);
            }

            resolve(res.rows);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while extracting the user");
          reject(id);
        });
    });
  }

  public async getOtherUserByUserName(
    id: string,
    username: string
  ): Promise<Array<User>> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
      select * from users where id != ${id} and username = '${username}';`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject({ id: id, username: username });
            }

            resolve(res.rows);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while extracting the user");
          reject(id);
        });
    });
  }

  public async getOtherUserByEmail(
    id: string,
    email: string
  ): Promise<Array<User>> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
      select * from users where id != ${id} and email = '${email}';`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject({ id: id, email: email });
            }

            resolve(res.rows);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while extracting the user");
          reject(id);
        });
    });
  }

  public async getOtherUsers(
    idExcept: string,
    username: string,
    email: string
  ): Promise<Array<User>> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
      select * from users where id != ${idExcept} and (username = '${username}' or email = '${email}');`;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject({ id: idExcept, username: username });
            }

            resolve(res.rows);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while extracting the user");
          reject(idExcept);
        });
    });
  }

  private async createTables(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      var client = this.getClient();
      const query = `
      create table if not exists users
      (
        id serial primary key,
        email text unique,
        userName text unique,
        passWord text,
        creationDt timestamp
      );
  `;
      client
        .connect()
        .then(() => {
          client.query(query, (err, res) => {
            if (err) {
              reject(res);
            }

            console.log("Tables successfully created!");
            resolve(true);
            client.end();
          });
        })
        .catch((error) => {
          this.loggerService.error(error, "Error while creating the tables");
        });
    });
  }

  private getClient(): any {
    const { Client } = require("pg");
    const client = new Client({
      user: databaseConfiguration.user,
      host: databaseConfiguration.host,
      database: databaseConfiguration.database,
      password: databaseConfiguration.password,
      port: databaseConfiguration.port
    });

    return client;
  }
}

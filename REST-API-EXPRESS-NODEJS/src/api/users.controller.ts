import { inject, injectable } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
  queryParam,
  request
} from "inversify-express-utils";
import { Request, Response } from "express";
import { DatabaseService } from "../core/services/database.service";
import { User } from "../models/user.model";
import { PasswordHashingService } from "../core/services/password-hashing.service";

@controller("/api/users")
@injectable()
export class UsersController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService,
    @inject(PasswordHashingService.name)
    private hashingService: PasswordHashingService
  ) {}

  @httpPost("/register")
  public async register(request: Request, response: Response): Promise<void> {
    try {
      var user = {
        email: request.body.email,
        username: request.body.username,
        password: this.hashingService.hash(request.body.password),
        creationdt: new Date()
      } as User;

      var users = await this.databaseService.getUsers(
        request.body.username,
        request.body.email
      );

      if (users.length > 0) {
        return response.status(401).json({
          error: `The user with the username \'${request.body.username}\' or email \'${request.body.email}\' already exists!`
        });
      }

      var insertedAccount = await this.databaseService.insertUser(user);
      return response.status(201).json(insertedAccount);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  @httpPost("/login")
  public async login(request: Request, response: Response): Promise<void> {
    try {
      var jwt = require("jsonwebtoken");
      var users = await this.databaseService.getUserByUserName(
        request.body.username
      );

      if (users.length == 0) {
        return response.status(401).json({
          error: `The username \'${request.body.username}\' does not exist!`
        });
      }

      var hashed = users[0].password;

      if (this.hashingService.isValid(request.body.password, hashed)) {
        var token = jwt.sign({ id: users[0].id }, "secret", {
          expiresIn: "3h"
        });

        return response.status(200).json(token);
      } else {
        return response.status(400).json({ error: "The password was wrong!" });
      }
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  @httpGet("/userid")
  public async verify(request: Request, response: Response): Promise<void> {
    try {
      var token = request.query.token;
      var jwt = require("jsonwebtoken");
      var decodedToken;
      jwt.verify(token, "secret", function (err, tokendata) {
        if (err) {
          return response.status(400).json({ error: "Unauthorized request!" });
        }
        if (tokendata) {
          decodedToken = tokendata;
        }
      });

      return response.status(200).json(decodedToken.id);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  @httpGet("/get-user")
  public async getUser(request: Request, response: Response): Promise<void> {
    try {
      var user = await this.databaseService.getUserById(request.query.id);
      if (user.length == 0) {
        return response.status(400).json({
          error: `The user with the ID \'${request.query.id}\' could not be found!`
        });
      }

      return response.status(200).json(user[0]);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  @httpPut("/edit")
  public async updateUser(request: Request, response: Response): Promise<void> {
    try {
      var users = await this.databaseService.getUserById(request.body.id);

      if (users.length == 0) {
        return response.status(400).json({
          error: `The user with the ID \'${request.body.id}\' could not be found!`
        });
      }

      var id = users[0].id;
      var others = await this.databaseService.getOtherUsers(
        id,
        request.body.username,
        request.body.email
      );

      if (others.length > 0) {
        return response.status(400).json({
          error: `The user with the username \'${request.body.username}\' or email \'${request.body.email}\' already exists!`
        });
      }

      var passWordHash = await this.hashingService.hash(request.body.password);
      var userToUpdate = {
        id: request.body.id,
        username: request.body.username,
        password: passWordHash,
        email: request.body.email,
        creationdt: request.body.creationdt
      } as User;

      var updatedUser = await this.databaseService.updateUser(userToUpdate);
      return response.status(200).json({});
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  @httpDelete("/:id")
  public async deleteUser(request: Request, response: Response): Promise<void> {
    try {
      var users = await this.databaseService.getUserById(request.params.id);

      if (users.length == 0) {
        return response.status(400).json({
          error: `The user with the ID \'${request.params.id}\' could not be found!`
        });
      }

      var deleted = await this.databaseService.deleteUserById(
        request.params.id
      );

      return response.status(200).json({});
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}

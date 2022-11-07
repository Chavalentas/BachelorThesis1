import { Container } from "inversify";
import { LoggerService } from "../services/logger.service";
import "reflect-metadata";
import { interfaces, TYPE } from "inversify-express-utils";
import { DatabaseService } from "../services/database.service";
import { UsersController } from "../../api/users.controller";
import { PasswordHashingService } from "../services/password-hashing.service";

export class IoContainer {
  private container = new Container();

  public init(): void {
    this.initServices();
    this.initController();
  }

  public getContainer(): Container {
    return this.container;
  }

  private initController(): void {
    this.container
      .bind<interfaces.Controller>(TYPE.Controller)
      .to(UsersController)
      .whenTargetNamed(UsersController.name);
  }

  private initServices(): void {
    this.container
      .bind<LoggerService>(LoggerService.name)
      .to(LoggerService)
      .inSingletonScope();
    this.container
      .bind<DatabaseService>(DatabaseService.name)
      .to(DatabaseService)
      .inSingletonScope();
    this.container
      .bind<PasswordHashingService>(PasswordHashingService.name)
      .to(PasswordHashingService)
      .inSingletonScope();
  }
}

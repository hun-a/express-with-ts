import * as express from 'express';

import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "../users/user.dto";
import LogInDto from "./login.dto";
import AuthenticationService from "./authentication.service";

export default class AuthenticationController implements Controller {
  public path: string = '/auth';
  public router: express.Router = express.Router();
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;

    try {
      const { cookie, user } = await this.authenticationService.register(userData);
      response.setHeader('Set-Cookie', [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData: LogInDto = request.body;

    try {
      const { cookie, user } = await this.authenticationService.login(logInData);
      response.setHeader('Set-Cookie', [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private loggingOut = (request: express.Request, response: express.Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.sendStatus(200);
  }
}
import * as express from 'express';

import Controller from "../interfaces/controller.interface";
import authMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import UserService from "./user.service";

export default class UserController implements Controller {
  public path: string = '/users';
  public router: express.Router =  express.Router();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
  }

  private getAllPostsOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
    const userId = request.params.id;

    try {
      const posts = await this.userService.getAllPostsOfUser(userId, request.user);
      response.send(posts);
    } catch (error) {
      next(error);
    }
  }
}
import * as express from 'express';

import Controller from "../interfaces/controller.interface";
import postModel from "../posts/posts.model";
import authMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";

export default class UserController implements Controller {
  public path: string = '/users';
  public router: express.Router =  express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
  }

  private getAllPostsOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
    const userId = request.params.id;

    if (userId === request.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      response.send(posts);
    }
  }
}
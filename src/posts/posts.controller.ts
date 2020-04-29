import * as express from 'express';

import Post from './post.interface';
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import PostsService from "./posts.service";

class PostsController implements Controller {
  public path = '/posts';
  public router = express.Router();
  private postsService = new PostsService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .put(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = async (request: express.Request, response: express.Response) => {
    const posts = await this.postsService.getAllPosts();
    response.send(posts);
  }

  private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;

    try {
      const post = await this.postsService.getPostById(id);
      response.send(post);
    } catch (error) {
      next(error);
    }
  }

  private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const postData: Post = request.body;

    try {
      const post = await this.postsService.modifyPost(id, postData);
      response.send(post);
    } catch (error) {
      next(error);
    }
  }

  private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;

    try {
      const statusCode = await this.postsService.deletePost(id);
      response.sendStatus(statusCode);
    } catch (error) {
      next(error);
    }
  }

  private createPost = async (request: RequestWithUser, response: express.Response) => {
    const postData: CreatePostDto = request.body;
    const post = await this.postsService.createPost(request.user, postData);
    response.send(post);
  }
}

export default PostsController;
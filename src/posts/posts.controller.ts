import * as express from 'express';

import Post from './post.interface';
import Controller from "./controller.interface";
import postModel from "./posts.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";

class PostsController implements Controller {
  public path = '/posts';
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.put(`${this.path}/:id`, this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = (request: express.Request, response: express.Response) => {
    this.post
      .find()
      .then(post => response.send(post));
  }

  private getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    this.post
      .findById(id)
      .then(post => {
        if (post) {
          response.send(post)
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  private modifyPost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const postData: Post = request.body;
    this.post
      .findByIdAndUpdate(id, postData, { new: true })
      .then(post => {
        if (post) {
          response.send(post)
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  private deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    this.post
      .findByIdAndDelete(id)
      .then(successResponse => {
        if (successResponse) {
          response.sendStatus(200);
        } else {
          next(new PostNotFoundException(id));
        }
      });
  }

  private createPost = (request: express.Request, response: express.Response) => {
    const postData: Post = request.body;
    const createdPost = new this.post(postData);
    createdPost.save()
      .then(savedPost => response.send(savedPost));
  }
}

export default PostsController;
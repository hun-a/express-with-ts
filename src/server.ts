import 'dotenv/config';
import App from './app';
import PostsController from './posts/posts.controller';
import validateEnv from './utils/validateEnv';
import AuthenticationController from "./authentication/authentication.controller";
import UserController from "./users/user.controller";

validateEnv();

const app = new App(
  [
    new PostsController(),
    new AuthenticationController(),
    new UserController(),
  ],
);

app.listen();
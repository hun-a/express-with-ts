import * as mongoose from 'mongoose';
import 'dotenv/config';
import App from './app';
import PostsController from './posts/posts.controller';

const {
    MONG_USER,
    MONG_PASSWORD,
    MONGO_PATH,
    PORT
} = process.env;

mongoose.connect(
  `mongodb+srv://${MONG_USER}:${MONG_PASSWORD}${MONGO_PATH}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const app = new App(
  [ new PostsController() ],
  Number(PORT),
);

app.listen();
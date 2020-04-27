import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private connectToTheDatabase() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;

    const uris: string = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;

    const options: mongoose.ConnectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    };

    mongoose
      .connect(uris, options)
      .catch(console.error);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
}

export default App;
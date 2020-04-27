import * as express from 'express';

import Controller from "../interfaces/controller.interface";
import userModel from "../users/user.model";

export default class ReportController implements Controller {
  public path: string = '/report';
  public router: express.Router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.generateReport);
  }

  private generateReport = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const usersByCountries = await this.user.aggregate(
      [
        {
          $group: {
            _id: { country: '$address.city' }
          },
        },
      ]
    );
    response.send({ usersByCountries })
  }
}
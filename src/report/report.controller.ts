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
          $match: {
            'address.country': {
              $exists: true,
            }
          }
        },
        {
          $group: {
            _id: {
              country: '$address.country',
            },
            users: {
              $push: {
                _id: '$_id',
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: 'posts',
            localField: 'users._id',
            foreignField: 'author',
            as: 'articles',
          }
        },
        {
          $addFields: {
            amountOfArticles: {
              $size: '$articles'
            }
          },
        },
        {
          $sort: {
            count: 1,
          },
        },
      ]
    );
    response.send({ usersByCountries })
  }
}
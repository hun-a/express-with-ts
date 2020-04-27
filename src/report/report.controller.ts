import * as express from 'express';

import Controller from "../interfaces/controller.interface";
import ReportService from "./report.service";

export default class ReportController implements Controller {
  public path: string = '/report';
  public router: express.Router = express.Router();
  private reportService = new ReportService();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.generateReport);
  }

  private generateReport = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const usersByCountries = await this.reportService.generateReport();
    response.send({ usersByCountries })
  }
}
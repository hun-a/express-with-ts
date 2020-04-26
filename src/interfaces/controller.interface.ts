import * as express from 'express';

interface Controller {
    path: string;
    router: express.Router;
    initializeRoutes();
}

export default Controller;
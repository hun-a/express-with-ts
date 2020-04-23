import * as express from 'express';

function loggerMiddleware(request: express.Request, response: express.Response, next) {
  console.log(`${request.method} ${request.path}`);
  next();
}

const app = express();

app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(5000);
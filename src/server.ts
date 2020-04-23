import * as express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.post('/', (req, res) => {
  res.send(req.body);
});

app.listen(5000);
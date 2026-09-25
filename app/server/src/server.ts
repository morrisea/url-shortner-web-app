import express from 'express';
import 'dotenv/config';
import user from './routes/user.js';
import cors from 'cors';

const server = express();
const port = 3000;

server.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

server.use(express.json());
server.use('/', user);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default server;

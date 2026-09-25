import express from 'express';
import 'dotenv/config';
import user from './routes/user.js'

const server = express();
const port = 3000;

server.use('/', user);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default server;
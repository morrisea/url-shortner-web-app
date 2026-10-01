import express from 'express';
import 'dotenv/config';
import user from './routes/user.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const server = express();
const port = 3000;

server.use(
  cors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

server.use(express.json());
server.use(cookieParser());

server.use('/api', user);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default server;

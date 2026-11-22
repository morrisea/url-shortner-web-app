import express from 'express';
import 'dotenv/config';
import user from './routes/user.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsConfig } from './config/cors.conf.js';
import { redirectLink } from './controllers/redirect.controller.js';
import helmet from 'helmet';

const server = express();
const port = process.env.PORT || 3000;

server.use(
  cors({
    origin: corsConfig.url,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

// clickjacking, xss, MIME sniffing protections
server.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'self'"],
    },
  }),
);

server.use(express.json());
server.use(cookieParser());

server.use('/api', user);
server.get('/:redirect', redirectLink);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default server;

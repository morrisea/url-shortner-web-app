import { Router, Request, Response } from 'express';
const user = Router();

user.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'response by get api'

    });
});

export default user;
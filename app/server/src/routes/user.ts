import { Router } from 'express';
import { register } from '../controllers/auth.controller.js';

const user = Router();

user.post('/api/auth/register', register);

export default user;

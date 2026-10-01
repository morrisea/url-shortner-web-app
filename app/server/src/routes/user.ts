import { Router } from 'express';
import { register } from '../controllers/register.controller.js';
import { login } from '../controllers/login.controller.js';
import { logout } from '../controllers/logout.controller.js';
import { dashboard } from '../controllers/dashboard.controller.js';
import { authToken } from '../middleware/jwt.middleware.js';
import { refreshToken } from '../controllers/refresh.controller.js';

const user = Router();

user.post('/register', register);
user.post('/login', login);
user.post('/refresh', refreshToken);
user.post('/logout', logout);

user.use(authToken);

user.get('/dashboard', dashboard);

export default user;

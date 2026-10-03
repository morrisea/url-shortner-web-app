import { Router } from 'express';
import { register } from '../controllers/register.controller.js';
import { login } from '../controllers/login.controller.js';
import { logout } from '../controllers/logout.controller.js';
import { dashboard } from '../controllers/dashboard.controller.js';
import { authToken } from '../middleware/jwt.middleware.js';
import { refreshToken } from '../controllers/refresh.controller.js';
import { resend } from '../controllers/resend.controller.js';
import { verify } from '../controllers/verify.controller.js';

const user = Router();

user.post('/register', register);
user.post('/login', login);
user.post('/refresh', refreshToken);
user.post('/logout', logout);
user.post('/resend-verification', resend);
user.get('/verify-email/', verify);

user.use(authToken);

user.get('/dashboard', dashboard);

export default user;

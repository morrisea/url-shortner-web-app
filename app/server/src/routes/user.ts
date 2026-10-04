import { Router } from 'express';
import { register } from '../controllers/register.controller.js';
import { login } from '../controllers/login.controller.js';
import { logout } from '../controllers/logout.controller.js';
import { dashboard } from '../controllers/dashboard.controller.js';
import { authToken } from '../middleware/jwt.middleware.js';
import { refreshToken } from '../controllers/refresh.controller.js';
import { resend } from '../controllers/resend.controller.js';
import { verify } from '../controllers/verify.controller.js';
import { sendMFA } from '../controllers/sendMFA.controller.js';
import { verifyMFA } from '../controllers/verifyMFA.controller.js';

const user = Router();

user.post('/register', register);
user.post('/login', login);
user.post('/refresh', refreshToken);
user.post('/logout', logout);
user.post('/resend-verification', resend);
user.post('/send-mfa', sendMFA);
user.post('/verify-mfa', verifyMFA);

user.get('/verify-email/', verify);

user.use(authToken);

user.get('/dashboard', dashboard);

export default user;

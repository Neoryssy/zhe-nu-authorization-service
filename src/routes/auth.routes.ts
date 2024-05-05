import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateBody } from '../middleware/validateBody.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { verifyRegister } from '../middleware/verifyRegister.middleware';

const router = Router();

router.post('/login', validateBody(loginSchema), UserController.login);

router.get('/logout', UserController.logout);

router.post(
  '/register',
  [verifyRegister.checkUserExists, validateBody(registerSchema)],
  UserController.register
);

router.delete('/remove', UserController.remove);

export default router;

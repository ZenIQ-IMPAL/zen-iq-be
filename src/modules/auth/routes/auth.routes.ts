import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../validators/auth.validator';
import { authenticateToken } from '../middlewares/auth.middleware'

const router = Router();
const authController = new AuthController();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get("/me", authenticateToken, authController.me);

export { router as authRoutes };
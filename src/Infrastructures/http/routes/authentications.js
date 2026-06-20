import { Router } from "express";
import authenticationsHandler from "../handlers/AuthenticationsHandler.js";
import { loginLimitter } from "../middlewares/RateLimiter.js";

const router = Router();

router.post('', loginLimitter, authenticationsHandler.login);
router.put('', authenticationsHandler.refreshToken);
router.delete('', authenticationsHandler.logout);

export default router;
import express from 'express';
import { getUserByServiceNumber } from '../controllers/userController.js';

const router = express.Router();



// Get user by service number
router.get('/service/:serviceNo', getUserByServiceNumber);

export default router;
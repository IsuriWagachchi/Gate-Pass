import express from 'express';
import { getApprovedRequests } from '../controllers/patrolLeaderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getApprovedRequests);

export default router;
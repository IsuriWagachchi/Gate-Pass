import express from 'express';

import {

    getRequests,

} from '../controllers/requestController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();


// Other routes remain the same
router.get('/', verifyToken, getRequests);

export default router;
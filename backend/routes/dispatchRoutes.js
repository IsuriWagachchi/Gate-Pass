import express from 'express';
import { getVerifiedRequests } from '../controllers/dispatchController.js';

const router = express.Router();

router.get('/verified', getVerifiedRequests);

export default router;

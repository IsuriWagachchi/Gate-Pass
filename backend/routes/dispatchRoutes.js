import express from 'express';
import { getDispatchById, getVerifiedRequests } from '../controllers/dispatchController.js';

const router = express.Router();

router.get('/verified', getVerifiedRequests);
router.get('/getDispatchById/:id',getDispatchById);

export default router;

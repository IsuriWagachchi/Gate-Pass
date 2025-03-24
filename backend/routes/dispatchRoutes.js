import express from 'express';
import { getDispatchById, getVerifiedRequests, updateDispatchStatus } from '../controllers/dispatchController.js';

const router = express.Router();

router.get('/verified', getVerifiedRequests);
router.get('/getDispatchById/:id',getDispatchById);
router.put("/updateApproval/:id", updateDispatchStatus);

export default router;

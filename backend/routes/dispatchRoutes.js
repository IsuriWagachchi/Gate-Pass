import express from 'express';
import { getDispatchById, getVerifiedRequests, updateDispatchStatusIn, updateDispatchStatusOut } from '../controllers/dispatchController.js';

const router = express.Router();

router.get('/verified', getVerifiedRequests);
router.get('/getDispatchById/:id',getDispatchById);
router.put("/updateApprovalOut/:id", updateDispatchStatusOut);
router.put("/updateApprovalIn/:id", updateDispatchStatusIn);

export default router;

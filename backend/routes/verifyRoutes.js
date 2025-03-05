
import express from 'express';
import {
  getAllRequests,
  updateRequestVerification,
  getRequestById
} from '../controllers/verifyController.js';

const router = express.Router();

// Get all requests for executive approval
router.get('/', getAllRequests);

// Update request status
router.put('/:id/verify', updateRequestVerification);

router.get('/:id', getRequestById);

export default router;

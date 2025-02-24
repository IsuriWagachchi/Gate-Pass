// routes/executiveRoutes.js
import express from 'express';
import {
  getAllRequests,
  updateRequestStatus
} from '../controllers/executiveController.js';

const router = express.Router();

// Get all requests for executive approval
router.get('/', getAllRequests);

// Update request status
router.put('/:id/status', updateRequestStatus);

export default router;

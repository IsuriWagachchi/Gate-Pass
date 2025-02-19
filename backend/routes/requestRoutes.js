// routes/requestRoutes.js
import express from 'express';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest
} from '../controllers/requestController.js';

const router = express.Router();

// Create a new request
router.post('/create', createRequest);

// Get all requests
router.get('/', getRequests);

// Get request by ID
router.get('/:id', getRequestById);

// Update request
router.put('/:id', updateRequest);

// Delete request
router.delete('/:id', deleteRequest);

export default router;

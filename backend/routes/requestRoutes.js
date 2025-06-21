import express from 'express';
import { uploadMultipleItems } from '../middleware/upload.js';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getAllRequests
} from '../controllers/requestController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Use the uploadMultipleItems middleware
router.post('/create', uploadMultipleItems, createRequest);
router.put('/:id', uploadMultipleItems, updateRequest);

router.get('/',verifyToken , getRequests);
router.get('/all', verifyToken, getAllRequests); // For admin to get all requests
router.get('/:id', getRequestById);
router.delete('/:id', deleteRequest);

export default router;
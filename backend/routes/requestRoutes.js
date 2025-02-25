import express from 'express';
import upload from '../middleware/upload.js';
import {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest
} from '../controllers/requestController.js';

const router = express.Router();

// Create a new request (with image upload)
router.post('/create', upload.single('image'), createRequest);

// Update request (with image upload)
router.put('/:id', upload.single('image'), updateRequest);

// Other routes
router.get('/', getRequests);
router.get('/:id', getRequestById);
router.delete('/:id', deleteRequest);

export default router;

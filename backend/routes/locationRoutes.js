import express from 'express';
import {
    createLocation,
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation
} from '../controllers/locationController.js';

const router = express.Router();

router.post('/', createLocation);
router.get('/', getLocations);
router.get('/:id', getLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

export default router;
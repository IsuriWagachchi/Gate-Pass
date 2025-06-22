import Location from '../models/locationModel.js';

// Create a single location
const createLocation = async (req, res) => {
    try {
        const location = new Location(req.body);
        await location.save();
        res.status(201).json({
            success: true,
            data: location
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        } else if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Location ID must be unique'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get all locations
const getLocations = async (req, res) => {
    try {
        const locations = await Location.find().sort({ created_at: -1 });
        res.status(200).json({
            success: true,
            count: locations.length,
            data: locations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single location
const getLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }
        res.status(200).json({
            success: true,
            data: location
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update location
const updateLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }
        res.status(200).json({
            success: true,
            data: location
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete location
const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    createLocation,
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation
};
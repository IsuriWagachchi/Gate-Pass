

/////////////////////////////////////////////////////////////////

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const locationSchema = new mongoose.Schema({
    location_id: {
        type: String,
        unique: true,
        trim: true,
        sparse: true
    },
    location_name: {
        type: String,
        required: [true, 'Location name is required'],
        trim: true
    },
    location_type: {
        type: String,
        required: [true, 'Location type is required'],
        enum: ['Office', 'Warehouse', 'Store', 'Other'],
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    district: {
        type: String,
        trim: true
    },
    postal_code: {
        type: String,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

locationSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

// Prevent overwriting model
const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;

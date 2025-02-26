import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import requestRoutes from './routes/requestRoutes.js';
import executiveRoutes from './routes/executiveRoutes.js';
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images as static files
app.use('/uploads', express.static('uploads'));
// Serve the uploads folder statically (adjusted for outside backend)
//app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// Routes
app.use('/api/requests', requestRoutes);
app.use('/api/executive', executiveRoutes);
app.use('/api/auth', authRoutes); // Use the routes for authentication


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error: ', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
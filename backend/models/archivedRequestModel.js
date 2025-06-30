// models/archivedRequestModel.js
import mongoose from 'mongoose';

const archivedRequestSchema = new mongoose.Schema({
  originalId: { type: mongoose.Schema.Types.ObjectId, required: true },
  archivedAt: { type: Date, default: Date.now },
  archivedBy: { type: String, required: true },
  reason: { type: String, required: true },
  requestData: { type: Object, required: true } // Stores the complete request object
}, {
  timestamps: true
});

const ArchivedRequest = mongoose.model('ArchivedRequest', archivedRequestSchema);

export default ArchivedRequest;
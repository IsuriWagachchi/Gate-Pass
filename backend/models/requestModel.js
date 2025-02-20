// models/requestModel.js
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  serialNo: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  returnable: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true,
});

const Request = mongoose.model('Request', requestSchema);

export default Request;

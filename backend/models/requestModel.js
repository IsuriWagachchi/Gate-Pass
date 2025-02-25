import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  serialNo: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  returnable: { type: String, required: true },
  image: { type: String },  // Image field added
  outLocation: { type: String, required: true },   // New field
  inLocation: { type: String, required: true },    // New field
  executiveOfficer: { type: String, required: true }, // New field
  receiverAvailable: { type: String, required: true }, // New field
  status: { type: String }  // New field for status
}, {
  timestamps: true,
});

const Request = mongoose.model('Request', requestSchema);

export default Request;

import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  serialNo: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  returnable: { type: String, required: true },
  image: { type: String }
});

const requestSchema = new mongoose.Schema({
  items: [itemSchema], // Array of items
  outLocation: { type: String, required: true },
  inLocation: { type: String, required: true },
  executiveOfficer: { type: String, required: true },
  receiverName: { type: String, required: true },
  receiverContact: { type: Number, required: true },
  receiverGroup: { type: String, required: true },
  receiverServiceNumber: { type: Number },
  vehicleNumber: { type: Number },
  byHand: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  verify: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  dispatchStatusOut: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  dispatchStatusIn: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  approverNameOut: { required: true, type: String },
  serviceNoOut: { required: true, type: String },
  commentOut: { type: String },
  approverNameIn: { required: true, type: String },
  serviceNoIn: { required: true, type: String },
  commentIn: { type: String }
}, {  // <-- The timestamps option should be part of the Schema options object
  timestamps: true,
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
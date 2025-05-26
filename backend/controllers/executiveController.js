// controllers/executiveController.js
import Request from '../models/requestModel.js';

// Get all requests for executive approval
const getAllRequests = async (req, res) => {
  try {

    const executiveOfficer = req.user.sender_name; 
    const requests = await Request.find({ executiveOfficer: executiveOfficer });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
};



// Update request status
// Update request status
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  try {
    // Validate that comment exists if status is Rejected
    if (status === "Rejected" && (!comment || comment.trim() === "")) {
      return res.status(400).json({ message: 'Executive comment is required when rejecting a request' });
    }

    const updateData = { 
      status,
      ...(comment && { executiveComment: comment }) // Store in executiveComment field
    };

    const updatedRequest = await Request.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request status', error });
  }
};

// Get request details by ID
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error fetching request", error });
  }
};

export { getAllRequests, updateRequestStatus, getRequestById };



// controllers/executiveController.js
import Request from '../models/requestModel.js';

// Get all requests for executive approval
const getAllRequests = async (req, res) => {
  try {
    

    const requests = await Request.find();

    // console.log("Requests found:", requests.length);
    

    res.status(200).json(requests);
  } catch (error) {
    console.error(" Error fetching requests:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



// Update request status
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRequest = await Request.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request status', error });
  }
};

export {
  getAllRequests,
  updateRequestStatus,
};

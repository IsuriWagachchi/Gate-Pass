// controllers/requestController.js
import Request from '../models/requestModel.js';

// Create a new request with image upload and new fields
const createRequest = async (req, res) => {
  const { itemName, serialNo, category, description, returnable, outLocation, inLocation, executiveOfficer, receiverAvailable, status } = req.body;
  const image = req.file ? req.file.path : null;

  try {
      const newRequest = new Request({
          itemName,
          serialNo,
          category,
          description,
          returnable,
          image,
          outLocation,
          inLocation,
          executiveOfficer,
          receiverAvailable,
          status // Added status field here
      });
      await newRequest.save();
      res.status(201).json(newRequest);
  } catch (err) {
      res.status(500).json({ message: 'Error creating request', error: err });
  }
};

// Get all requests
const getRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
};

// Get request by ID
const getRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching request', error: err });
  }
};

// Update request with new fields and image
const updateRequest = async (req, res) => {
  const { id } = req.params;
  const { itemName, serialNo, category, description, returnable, outLocation, inLocation, executiveOfficer, receiverAvailable, status } = req.body;
  const image = req.file ? req.file.path : null;

  try {
      const updatedRequest = await Request.findByIdAndUpdate(
          id,
          { 
            itemName, 
            serialNo, 
            category, 
            description, 
            returnable, 
            outLocation, 
            inLocation, 
            executiveOfficer, 
            receiverAvailable, 
            status, // Added status field here
            ...(image && { image }) // Handle image upload if available
          },
          { new: true }
      );
      if (!updatedRequest) {
          return res.status(404).json({ message: 'Request not found' });
      }
      res.status(200).json(updatedRequest);
  } catch (err) {
      res.status(500).json({ message: 'Error updating request', error: err });
  }
};

// Delete request
const deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await Request.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting request', error: err });
  }
};

export {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest
};

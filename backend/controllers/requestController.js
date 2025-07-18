import Request from '../models/requestModel.js';

const createRequest = async (req, res) => {
  try {
    //console.log("📦 RAW req.body:", req.body);
    
    // Extract common fields
    const {
      sender_name,
      designation,
      service_no,
      section,
      group_number,
      contact_number,
      outLocation,
      inLocation,
      executiveOfficer,
      receiverName,
      receiverContact,
      receiverGroup,
      receiverServiceNumber,
      vehicleNumber,
      byHand,
      receiverIdNumber,
      receiverContactteli,
      ...itemsData
    } = req.body;

    // Convert receiverAvailable to boolean
    const receiverAvailable = req.body.receiverAvailable === true || 
                            req.body.receiverAvailable === 'true';

    // Validate byHand and vehicleNumber
    if (byHand === "No" && !vehicleNumber?.trim()) {
      return res.status(400).json({ 
        message: "Vehicle number is required when not delivering by hand" 
      });
    }
    
    if (byHand === "Yes" && vehicleNumber?.trim()) {
      return res.status(400).json({ 
        message: "Vehicle number should be empty when delivering by hand" 
      });
    }

    // Process items array - NEW IMPROVED VERSION
    let items = [];
    
    // Handle both array-style items and direct items object
    if (Array.isArray(req.body.items)) {
      // If items is already an array (from frontend)
      items = req.body.items.map(item => ({
        itemName: item.itemName,
        serialNo: item.serialNo,
        category: item.category,
        description: item.description,
        returnable: item.returnable,
        quantity: item.quantity,
        images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images || []
      }));
    } else {
      // Parse items from FormData-style fields
      items = Object.entries(req.body)
        .filter(([key]) => key.startsWith('items['))
        .reduce((acc, [key, value]) => {
          const match = key.match(/^items\[(\d+)\]\[(\w+)\]$/);
          if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            
            if (!acc[index]) acc[index] = {};
            
            if (field === "images") {
              try {
                acc[index][field] = typeof value === 'string' ? JSON.parse(value) : value;
              } catch {
                acc[index][field] = [];
              }
            } else {
              acc[index][field] = value;
            }
          }
          return acc;
        }, [])
        .filter(item => item); // Remove empty slots
    }

    

    // Validate we have at least one item
    if (items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    // Create new request
    const newRequest = new Request({
      sender_name,
      designation,
      service_no,
      section,
      group_number,
      contact_number,
      items,
      outLocation,
      inLocation,
      executiveOfficer,
      receiverAvailable,
      receiverName,
      receiverContact,
      receiverIdNumber,
      receiverContactteli,
      receiverGroup,
      receiverServiceNumber,
      vehicleNumber: byHand === "Yes" ? "" : vehicleNumber,
      byHand,
      status: 'Pending',
      verify: 'Pending',
      dispatchStatus: 'Pending'
    });

    await newRequest.save();
    
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ 
      message: 'Error creating request', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update request with validation for byHand and vehicleNumber
const updateRequest = async (req, res) => {
  const { id } = req.params;
  const { 
    itemName, 
    serialNo, 
    category, 
    description, 
    returnable, 
    outLocation, 
    inLocation, 
    executiveOfficer,
    vehicleNumber,
    byHand,
    receiverName,
    receiverContact,
    receiverIdNumber,
    receiverContactteli,
    receiverGroup,
    receiverServiceNumber, 
    status,
    quantity 
  } = req.body;

  try {
    
    if (byHand === "No" && !vehicleNumber?.trim()) {
      return res.status(400).json({ 
        message: "Vehicle number is required when not delivering by hand" 
      });
    }
    
    if (byHand === "Yes" && vehicleNumber?.trim()) {
      return res.status(400).json({ 
        message: "Vehicle number should be empty when delivering by hand" 
      });
    }

    const updateData = {
      itemName, 
      serialNo, 
      category, 
      description, 
      returnable, 
      outLocation, 
      inLocation, 
      executiveOfficer,
      vehicleNumber: byHand === "Yes" ? "" : vehicleNumber, // Ensure empty if byHand
      byHand,
      receiverName,
      receiverContact,
      receiverIdNumber,
      receiverContactteli,
      receiverGroup,
      receiverServiceNumber,
      status,
      quantity
    };

    // Handle image upload if available
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      updateData,
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

// Get all requests
const getRequests = async (req, res) => {
  try {
    const serviceNo = req.user.service_no;
    const requests = await Request.find({ service_no: serviceNo });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
};

// Get all requests for admin
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
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
  deleteRequest,
  getAllRequests
};
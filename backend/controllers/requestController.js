import Request from '../models/requestModel.js';




const createRequest = async (req, res) => {
  try {
    // Extract common fields
    const {
      outLocation,
      inLocation,
      executiveOfficer,
      receiverName,
      receiverContact,
      receiverGroup,
      receiverServiceNumber,
      vehicleNumber,
      byHand,
      ...itemsData
    } = req.body;

    // Process items array from form data
    const items = [];
    const files = req.files || [];
    
    // Determine if we have multiple items or single item
    if (Array.isArray(itemsData.items)) {
      // Multiple items case
      itemsData.items.forEach((item, index) => {
        const newItem = {
          itemName: item.itemName,
          serialNo: item.serialNo,
          category: item.category,
          quantity: item.quantity,
          description: item.description,
          returnable: item.returnable,
          image: files.find(f => f.fieldname === `items[${index}][image]`)?.path || null
        };
        items.push(newItem);
      });
    } else if (itemsData.itemName) {
      // Single item case (legacy support)
      items.push({
        itemName: itemsData.itemName,
        serialNo: itemsData.serialNo,
        category: itemsData.category,
        quantity: itemsData.quantity,
        description: itemsData.description,
        returnable: itemsData.returnable,
        image: req.file?.path || null
      });
    }

    // Create new request with items array
    const newRequest = new Request({
      items,
      outLocation,
      inLocation,
      executiveOfficer,
      receiverName,
      receiverContact,
      receiverGroup,
      receiverServiceNumber,
      vehicleNumber,
      byHand,
      status: 'Pending',
      verify: 'Pending',
      dispatchStatus: 'Pending'
    });

    await newRequest.save();
    
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
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
  const { itemName, serialNo, category, description, returnable, outLocation, inLocation, executiveOfficer,vehicleNumber,byHand,receiverName,receiverContact,receiverGroup,receiverServiceNumber, status,quantity } = req.body;
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
            executiveOfficer,vehicleNumber,byHand,
             receiverName
            ,receiverContact,
            receiverGroup,
            receiverServiceNumber,
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
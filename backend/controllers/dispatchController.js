import Request from '../models/requestModel.js';

// Get only verified requests
export const getVerifiedRequests = async (req, res) => {
  try {
    // Get logged-in user's branch_location
    const userBranch = req.user?.branch_location;

    if (!userBranch) {
      return res.status(400).json({ message: "Branch location missing from token" });
    }

    // Fetch only verified requests that match the branch location
    const verifiedRequests = await Request.find({
      verify: "Verified",
      $or: [{ inLocation: userBranch }, { outLocation: userBranch }],
    });
    
    res.status(200).json(verifiedRequests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching verified requests', error: err });
  }
};


// Get dispatch item bt Id
export const getDispatchById = async(req, res) => {
  const {id} = req.params;

  try{
    const request = await Request.findById(id);
    if(!request){
      return res.status(404).json({message: "Dispatch item not found"});
    }
    res.status(200).json(request);
  }catch(err){
    res.status(500).json({ message: 'Error fetching request', error: err });
  }
};

// update dispatch status
export const updateDispatchStatusOut = async (req, res) => {
  const { id } = req.params;
  const { dispatchStatusOut, approverNameOut, serviceNoOut, commentOut } = req.body;

  // Validation
  if (!approverNameOut || !serviceNoOut) {
    return res.status(400).json({ message: "Name and Service Number are required!" });
  }
  if (dispatchStatusOut === "Rejected" && !commentOut) {
    return res.status(400).json({ message: "Comment is required for rejection!" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.dispatchStatusOut = dispatchStatusOut;
    request.approverNameOut = approverNameOut;
    request.serviceNoOut = serviceNoOut;
    request.commentOut = commentOut || ""; 

    await request.save();
    res.status(200).json({ message: `Request ${dispatchStatusOut} successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Error updating approval status", error });
  }
};

export const updateDispatchStatusIn = async (req, res) => {
  const { id } = req.params;
  const { dispatchStatusIn, approverNameIn, serviceNoIn, commentIn } = req.body;

  // Validation
  if (!approverNameIn || !serviceNoIn) {
    return res.status(400).json({ message: "Name and Service Number are required!" });
  }
  if (dispatchStatusIn === "Rejected" && !commentIn) {
    return res.status(400).json({ message: "Comment is required for rejection!" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.dispatchStatusIn = dispatchStatusIn;
    request.approverNameIn = approverNameIn;
    request.serviceNoIn = serviceNoIn;
    request.commentIn = commentIn || ""; 

    await request.save();
    res.status(200).json({ message: `Request ${dispatchStatusIn} successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Error updating approval status", error });
  }
};

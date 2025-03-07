import Request from '../models/requestModel.js';

// Get only verified requests
export const getVerifiedRequests = async (req, res) => {
  try {
    const verifiedRequests = await Request.find({ verify: 'Verified' });
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
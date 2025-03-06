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


import Request from '../models/requestModel.js';
import User from '../models/userModel.js';

export const getApprovedRequests = async (req, res) => {
  try {
    
    
    // 1. Get authenticated user
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('ERROR: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    

    // 2. Create the query
    const query = {
      status: 'Approved',
      $or: [
        { inLocation: user.branch_location },
        { outLocation: user.branch_location }
      ]
    };

   

    // 3. Execute query
    const requests = await Request.find(query)
      .sort({ updatedAt: -1 });

    // 4. Verify database content
    const allApprovedCount = await Request.countDocuments({ status: 'Approved' });
    const branchInCount = await Request.countDocuments({ 
      status: 'Approved',
      inLocation: user.branch_location 
    });
    const branchOutCount = await Request.countDocuments({ 
      status: 'Approved',
      outLocation: user.branch_location 
    });

    

    res.status(200).json(requests);
    
  } catch (error) {
    console.error('CONTROLLER ERROR:', error);
    res.status(500).json({ 
      message: 'Failed to fetch requests',
      error: error.message 
    });
  }
};
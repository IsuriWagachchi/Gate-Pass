import User from '../models/userModel.js';

const getUserByServiceNumber = async (req, res) => {
    try {
      const user = await User.findOne({ service_no: req.params.serviceNo });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Return only necessary details
      res.status(200).json({
        _id: user._id,
        sender_name: user.sender_name,
        designation: user.designation,
        service_no: user.service_no,
        section: user.section,
        group_number: user.group_number,
        contact_number: user.contact_number
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  };

  export { getUserByServiceNumber };
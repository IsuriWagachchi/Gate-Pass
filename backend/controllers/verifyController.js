import User from '../models/userModel.js';
import Request from '../models/requestModel.js';
import { sendEmail } from '../../frontend/src/components/emails/emailService.js';
// Get all requests for executive approval
const getAllRequests = async (req, res) => {
    try {
      const requests = await Request.find({ status: "Approved" });
  
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };  


// Update request verification status
const updateRequestVerification = async (req, res) => {
    const { id } = req.params;
    const { verify, comment } = req.body; // Add comment to destructuring
  
    try {
      // Validate comment if rejecting
      if (verify === "Rejected" && (!comment || comment.trim() === "")) {
        return res.status(400).json({ message: 'Comment is required when rejecting a request' });
      }

      // Get the full request first
      const request = await Request.findById(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      // Get sender user details
      const senderUser = await User.findOne({ sender_name: request.sender_name });
      if (!senderUser) {
        return res.status(404).json({ message: 'Sender user not found' });
      }

      // Update the request
      const updatedRequest = await Request.findByIdAndUpdate(
        id, 
        { verify, comment }, // Include comment in update
        { new: true }
      );

      // Send email notification
      try {
        if (verify === "Verified") {
          // Create email content for verification
          const itemsList = request.items.map(item => 
            `- ${item.itemName} (Serial: ${item.serialNo}, Qty: ${item.quantity})`
          ).join('\n');

          await sendEmail(
            senderUser.email,
            'Request Verified by Duty Officer',
            `Your request (ID: ${id}) has been verified.\n\n` +
            `Items:\n${itemsList}\n\n` +
            `The items are now ready for dispatch.`,
            `<div>
              <h2>Request Verified</h2>
              <p>Your request (ID: ${id}) has been verified by the duty officer.</p>
              <h3>Items:</h3>
              <ul>${request.items.map(item => 
                `<li>${item.itemName} (Serial: ${item.serialNo}, Qty: ${item.quantity})</li>`
              ).join('')}</ul>
              <p>The items are now ready for dispatch.</p>
            </div>`
          );

        } else if (verify === "Rejected") {
          // Create email content for rejection
          const itemsList = request.items.map(item => 
            `- ${item.itemName} (Serial: ${item.serialNo}, Qty: ${item.quantity})`
          ).join('\n');

          await sendEmail(
            senderUser.email,
            'Request Rejected by Duty Officer',
            `Your request (ID: ${id}) has been rejected.\n\n` +
            `Reason: ${comment}\n\n` +
            `Items:\n${itemsList}\n\n` +
            `Please contact the duty officer for more information.`,
            `<div>
              <h2>Request Rejected</h2>
              <p>Your request (ID: ${id}) has been rejected by the duty officer.</p>
              <p><strong>Reason:</strong> ${comment}</p>
              <h3>Items:</h3>
              <ul>${request.items.map(item => 
                `<li>${item.itemName} (Serial: ${item.serialNo}, Qty: ${item.quantity})</li>`
              ).join('')}</ul>
              <p>Please contact the duty officer for more information.</p>
            </div>`
          );
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Continue even if email fails
      }

      res.status(200).json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Error updating request verification", error: error.message });
    }
};
  

// Get request details by ID (Only if Approved)
const getRequestById = async (req, res) => {
    try {
      const request = await Request.findOne({ _id: req.params.id, status: "Approved" });
  
      if (!request) {
        return res.status(404).json({ message: "Approved request not found" });
      }
  
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ message: "Error fetching request", error: error.message });
    }
  };

  const assignRequestToOfficer = async (req, res) => {
    const { id } = req.params;
    const { assignedOfficer, assignedOfficerName, assignedOfficerServiceNo } = req.body;
  
    try {
      const updatedRequest = await Request.findByIdAndUpdate(
        id,
        { 
          assignedOfficer,
          assignedOfficerName,
          assignedOfficerServiceNo,
          assignedAt: new Date()
        },
        { new: true }
      );
  
      if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
  
      res.status(200).json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Error assigning request", error: error.message });
    }
  };
  

export { getAllRequests, updateRequestVerification, getRequestById, assignRequestToOfficer };



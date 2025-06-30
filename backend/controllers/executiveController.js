// controllers/executiveController.js
import Request from '../models/requestModel.js';
import User from '../models/userModel.js';
import { sendEmail } from '../../frontend/src/components/emails/emailService.js';
import ArchivedRequest from '../models/archivedRequestModel.js';

// Get all requests for executive approval
const getAllRequests = async (req, res) => {
  try {

    const executiveOfficer = req.user.sender_name; 
    const requests = await Request.find({ executiveOfficer: executiveOfficer });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
};



// Update request status
// Update request status
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  try {
    // Validate that comment exists if status is Rejected
    if (status === "Rejected" && (!comment || comment.trim() === "")) {
      return res.status(400).json({ message: 'Executive comment is required when rejecting a request' });
    }

    // Get the request first to access sender information
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Get sender user details
    const senderUser = await User.findOne({ sender_name: request.sender_name });
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender user not found' });
    }

    const updateData = { 
      status,
      ...(comment && { executiveComment: comment })
    };

    const updatedRequest = await Request.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Send email notifications
    try {
      if (status === "Approved") {
        // HTML email template for approval
        const senderHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2A6BAC;">Your Request Has Been Approved</h2>
            <p>Your item transfer request has been approved by the executive officer.</p>
            
            <h3 style="color: #2A6BAC;">Request Details</h3>
            <p><strong>Request ID:</strong> ${id}</p>
            <p><strong>From Location:</strong> ${request.outLocation}</p>
            <p><strong>To Location:</strong> ${request.inLocation}</p>
            
            <h3 style="color: #2A6BAC; margin-top: 20px;">Items</h3>
            ${generateItemsHTML(request.items)}
            
            <p style="margin-top: 20px;">Thank you for using our system.</p>
          </div>
        `;

        // Text version for fallback
        const senderText = `Your item transfer request (ID: ${id}) has been approved.\n\n` +
          `From: ${request.outLocation}\n` +
          `To: ${request.inLocation}\n\n` +
          `Items:\n${request.items.map(item => 
            `- ${item.itemName} (Serial: ${item.serialNo}, Qty: ${item.quantity})`
          ).join('\n')}\n\nThank you.`;

        await sendEmail(
          senderUser.email,
          'Your Request Has Been Approved',
          senderText,
          senderHtml
        );

        // Find duty officer in the sender's branch location
        const dutyOfficers = await User.find({ 
          branch_location: senderUser.branch_location,
          role: 'duty_officer'
        });

        // Duty officer email template
        const officerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2A6BAC;">New Approved Transfer Request</h2>
            <p>A new item transfer request has been approved and requires your attention.</p>
            
            <h3 style="color: #2A6BAC;">Request Details</h3>
            <p><strong>Request ID:</strong> ${id}</p>
            <p><strong>Sender:</strong> ${request.sender_name}</p>
            <p><strong>Service No:</strong> ${request.service_no}</p>
            <p><strong>From Location:</strong> ${request.outLocation}</p>
            <p><strong>To Location:</strong> ${request.inLocation}</p>
            
            <h3 style="color: #2A6BAC; margin-top: 20px;">Items</h3>
            ${generateItemsHTML(request.items)}
            
            <p style="margin-top: 20px;">Please review the request in the system.</p>
          </div>
        `;

        const officerText = `A new item transfer request (ID: ${id}) has been approved.\n\n` +
          `Sender: ${request.sender_name}\n` +
          `Service No: ${request.service_no}\n` +
          `From: ${request.outLocation}\n` +
          `To: ${request.inLocation}\n\n` +
          `Items:\n${request.items.map(item => 
            `- ${item.itemName} (Serial: ${item.serialNo}, Qty: ${item.quantity})`
          ).join('\n')}\n\nPlease review the request in the system.`;

        // Email to all duty officers in the branch
        for (const officer of dutyOfficers) {
          await sendEmail(
            officer.email,
            'New Approved Transfer Request',
            officerText,
            officerHtml
          );
        }
      } else if (status === "Rejected") {
        // HTML email template for rejection
        const rejectionHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d9534f;">Your Request Has Been Rejected</h2>
            <p>Your item transfer request has been rejected by the executive officer.</p>
            
            <h3 style="color: #2A6BAC;">Request Details</h3>
            <p><strong>Request ID:</strong> ${id}</p>
            <p><strong>Reason for Rejection:</strong> ${comment}</p>
            
            <h3 style="color: #2A6BAC; margin-top: 20px;">Items</h3>
            ${generateItemsHTML(request.items)}
            
            <p style="margin-top: 20px;">Please contact the executive officer for more information.</p>
          </div>
        `;

        const rejectionText = `Your item transfer request (ID: ${id}) has been rejected.\n\n` +
          `Reason: ${comment}\n\n` +
          `Items:\n${request.items.map(item => 
            `- ${item.itemName} (Serial: ${item.serialNo}, Qty: ${item.quantity})`
          ).join('\n')}\n\nPlease contact the executive officer for more information.`;

        await sendEmail(
          senderUser.email,
          'Your Request Has Been Rejected',
          rejectionText,
          rejectionHtml
        );
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the whole request if email fails
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request status', error });
  }
};

// Get request details by ID
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error fetching request", error });
  }
};

const generateItemsHTML = (items) => {
  return items.map(item => `
    <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #2A6BAC;">${item.itemName}</h3>
      <p><strong>Serial No:</strong> ${item.serialNo}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Quantity:</strong> ${item.quantity}</p>
      <p><strong>Description:</strong> ${item.description}</p>
      <p><strong>Returnable:</strong> ${item.returnable}</p>
    </div>
  `).join('');
};



// cancel function at the bottom (before exports)
const archiveRequest = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const archivedBy = req.user.sender_name;

  try {
    // Get the request first
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Create archived copy
    const archivedRequest = new ArchivedRequest({
      originalId: id,
      archivedBy,
      reason,
      requestData: request.toObject()
    });

    await archivedRequest.save();

    // Delete the original request
    await Request.findByIdAndDelete(id);

    // Get sender user details for notification
    const senderUser = await User.findOne({ sender_name: request.sender_name });
    if (senderUser) {
      // Send email notification
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d9534f;">Your Request Has Been Cancelled</h2>
          <p>Your item transfer request has been cancelled by the executive officer.</p>
          
          <h3 style="color: #2A6BAC;">Request Details</h3>
          <p><strong>Request ID:</strong> ${id}</p>
          <p><strong>Reason for Cancellation:</strong> ${reason}</p>
          
          <h3 style="color: #2A6BAC; margin-top: 20px;">Items</h3>
          ${generateItemsHTML(request.items)}
          
          <p style="margin-top: 20px;">Please contact the executive officer for more information.</p>
        </div>
      `;

      const text = `Your item transfer request (ID: ${id}) has been cancelled.\n\n` +
        `Reason: ${reason}\n\n` +
        `Items:\n${request.items.map(item => 
          `- ${item.itemName} (Serial: ${item.serialNo}, Qty: ${item.quantity})`
        ).join('\n')}\n\nPlease contact the executive officer for more information.`;

      await sendEmail(
        senderUser.email,
        'Your Request Has Been Cancelled',
        text,
        html
      );
    }

    res.status(200).json({ message: 'Request archived successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving request', error });
  }
};

//get cancel request from db
const getArchivedRequests = async (req, res) => {
  try {
    const archivedRequests = await ArchivedRequest.find()
      .sort({ archivedAt: -1 }) // Sort by most recent first
      .populate({
        path: 'originalId',
        select: 'sender_name service_no outLocation inLocation createdAt items'
      });
    
    res.status(200).json(archivedRequests);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching archived requests', 
      error: error.message 
    });
  }
};



export { getAllRequests, updateRequestStatus, getRequestById ,archiveRequest,getArchivedRequests};



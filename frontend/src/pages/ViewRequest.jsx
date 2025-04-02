import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import { jsPDF } from "jspdf";

const ViewRequest = () => {
  const [request, setRequest] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
    fetchUser();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setRequest(response.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await axios.delete(`http://localhost:5000/api/requests/${id}`);
        navigate("/my-request");
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/update-request/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const downloadPdf = () => {
    if (!request || !user) return;
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const boxWidth = pageWidth - 2 * margin;
    const columnWidth = (boxWidth - 20) / 2;
    const textPadding = 6;
    const LABEL_VALUE_GAP = 0.5; // Consistent gap between labels and values
    let pageCount = 1;
  
    // Colors
    const colors = {
      primary: [42, 107, 172],
      success: [0, 128, 0],
      danger: [255, 0, 0],
      warning: [255, 165, 0],
      darkBlue: [0, 0, 139],
      darkGreen: [0, 100, 0],
      gray: [209, 213, 219],
      white: [255, 255, 255]
    };
  
    // Draw rounded box with fill and border
    const roundedRectWithBorder = (x, y, width, height, radius, fillColor, borderColor = colors.gray) => {
      doc.setDrawColor(...borderColor);
      doc.setFillColor(...fillColor);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, width, height, radius, radius, 'FD');
    };
  
    // Create standard box container with consistent title style
    const createBoxContainer = (title, content, yPos, titleColor = colors.darkBlue) => {
      // Calculate content height
      let contentHeight = textPadding;
      content.forEach(item => {
        const text = `${item.label}: ${item.value}`;
        contentHeight += Math.max(
          doc.splitTextToSize(text, boxWidth - textPadding * 2).length * 5.5,
          12
        );
      });
  
      const boxHeight = 15 + contentHeight + (textPadding / 2);
      
      // Check for page break
      if (yPos + boxHeight > pageHeight - margin - 10) {
        doc.addPage();
        pageCount++;
        yPos = margin;
        doc.setFontSize(18);
        doc.setTextColor(...colors.primary);
        doc.text("REQUEST DETAILS", pageWidth / 2, 20, { align: 'center' });
      }
  
      // Draw container
      roundedRectWithBorder(margin, yPos, boxWidth, boxHeight, 3, colors.white);
      
      // Draw title bar (matches other section titles)
      roundedRectWithBorder(margin, yPos, boxWidth, 12, 3, titleColor, titleColor);
      doc.setTextColor(...colors.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(title, margin + textPadding, yPos + 8);
      
      // Add content with consistent label-value spacing
      let currentY = yPos + 17;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      content.forEach((item, index) => {
        const fullText = `${item.label}: ${item.value}`;
        const lines = doc.splitTextToSize(fullText, boxWidth - textPadding * 2);
        
        // Draw label
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.label}:`, margin + textPadding, currentY);
        
        // Calculate label width with gap
        const labelWidth = doc.getTextWidth(`${item.label}: `) + LABEL_VALUE_GAP;
        
        // Draw value with proper spacing
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(item.value, boxWidth - textPadding * 2 - labelWidth);
        
        // Draw first line
        doc.text(valueLines[0], margin + textPadding + labelWidth, currentY);
        
        // Draw remaining lines (if any)
        let yOffset = 0;
        for (let i = 1; i < valueLines.length; i++) {
          yOffset += 5;
          doc.text(valueLines[i], margin + textPadding + labelWidth, currentY + yOffset);
        }
        
        currentY += Math.max(valueLines.length * 5.5, 12);
        
        // Add separator line between items (except last one)
        if (index < content.length - 1) {
          doc.setDrawColor(...colors.gray);
          doc.setLineWidth(0.1);
          doc.line(
            margin + textPadding, 
            currentY - 0.5, 
            margin + boxWidth - textPadding, 
            currentY - 0.5
          );
          currentY += 2;
        }
      });
  
      return yPos + boxHeight + 8;
    };
  
    // Create item box with consistent title style
    const createItemBox = (item, index, yPos) => {
      const itemTitle = `Item ${index + 1}`;
      const itemHeight = 60;
      
      // Check for page break
      if (yPos + itemHeight > pageHeight - margin - 10) {
        doc.addPage();
        pageCount++;
        yPos = margin;
        doc.setFontSize(18);
        doc.setTextColor(...colors.primary);
        doc.text("REQUEST DETAILS", pageWidth / 2, 20, { align: 'center' });
      }
  
      // Draw container
      roundedRectWithBorder(margin, yPos, boxWidth, itemHeight, 3, colors.white);
      
      // Draw item title bar (matches other section titles)
      roundedRectWithBorder(margin, yPos, boxWidth, 12, 3, colors.darkBlue, colors.darkBlue);
      doc.setTextColor(...colors.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(itemTitle, margin + textPadding, yPos + 8);
      
      // Item name (below title bar)
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(item.itemName, margin + textPadding, yPos + 20);
      
      // Left column items
      const leftColumn = [
        { label: "Serial No", value: item.serialNo || 'N/A' },
        { label: "Category", value: item.category || 'N/A' }
      ];
      
      // Right column items
      const rightColumn = [
        { label: "Quantity", value: item.quantity || '1' },
        { label: "Returnable", value: item.returnable === 'yes' ? 'Yes' : 'No' }
      ];
      
      // Draw left column with consistent spacing
      let currentY = yPos + 25;
      doc.setFontSize(10);
      leftColumn.forEach((field, i) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${field.label}:`, margin + 10, currentY + (i * 15));
        
        doc.setFont('helvetica', 'normal');
        const labelWidth = doc.getTextWidth(`${field.label}: `) + LABEL_VALUE_GAP;
        const valueLines = doc.splitTextToSize(field.value, columnWidth - labelWidth - 5);
        
        let yOffset = 0;
        valueLines.forEach((line, lineIndex) => {
          doc.text(line, margin + 10 + labelWidth, currentY + (i * 15) + yOffset);
          yOffset += 5;
        });
      });
      
      // Draw right column with consistent spacing
      rightColumn.forEach((field, i) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${field.label}:`, margin + 10 + columnWidth, currentY + (i * 15));
        
        doc.setFont('helvetica', 'normal');
        const labelWidth = doc.getTextWidth(`${field.label}: `) + LABEL_VALUE_GAP;
        const valueLines = doc.splitTextToSize(field.value, columnWidth - labelWidth - 5);
        
        let yOffset = 0;
        valueLines.forEach((line, lineIndex) => {
          doc.text(line, margin + 10 + columnWidth + labelWidth, currentY + (i * 15) + yOffset);
          yOffset += 5;
        });
      });
      
      // Draw description with consistent spacing
      doc.setFont('helvetica', 'bold');
      doc.text("Description:", margin + 10, yPos + 50);
      
      doc.setFont('helvetica', 'normal');
      const descLabelWidth = doc.getTextWidth("Description:") + LABEL_VALUE_GAP;
      const descLines = doc.splitTextToSize(item.description || 'N/A', boxWidth - 20 - descLabelWidth);
      
      descLines.forEach((line, i) => {
        doc.text(line, margin + 10 + descLabelWidth, yPos + 50 + (i * 5));
      });
      
      return yPos + itemHeight + 10;
    };
  
    // Header
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);
    doc.text("REQUEST DETAILS", pageWidth / 2, 20, { align: 'center' });
  
    // Reference Number
    doc.setFontSize(14);
    doc.setTextColor(...colors.white);
    roundedRectWithBorder(margin, 30, boxWidth, 12, 3, colors.primary);
    doc.text(`Ref. No: ${request._id}`, pageWidth / 2, 37, { align: 'center' });
  
    // Status Badge
    let statusColor, statusBg;
    if (request.status === 'Approved') {
      statusColor = colors.success;
      statusBg = [200, 230, 200];
    } else if (request.status === 'Rejected') {
      statusColor = colors.danger;
      statusBg = [255, 200, 200];
    } else {
      statusColor = colors.warning;
      statusBg = [255, 240, 200];
    }
  
    doc.setFontSize(12);
    doc.setTextColor(...statusColor);
    roundedRectWithBorder(margin, 45, boxWidth, 10, 3, statusBg);
    doc.text(`Status: ${request.status}`, pageWidth / 2, 52, { align: 'center' });
  
    // Date
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${formatDate(request.createdAt)}`, margin + doc.getTextWidth("Date: ") + LABEL_VALUE_GAP, 65);
  
    let yPosition = 75;
  
    // Sender Details
    yPosition = createBoxContainer(
      "Sender Details",
      [
        { label: "Name", value: user.username },
        { label: "Email", value: user.email },
        { label: "Contact", value: user.contact_number }
      ],
      yPosition
    );
  
    // Receiver Details
    yPosition = createBoxContainer(
      "Receiver Details",
      [
        { label: "Name", value: request.receiverName },
        { label: "Contact No", value: request.receiverContact },
        { label: "Group", value: request.receiverGroup },
        ...(request.receiverServiceNumber ? [{ label: "Service No", value: request.receiverServiceNumber }] : [])
      ],
      yPosition,
      colors.darkGreen
    );

    // Individual Items with consistent title bars
    request.items.forEach((item, index) => {
      yPosition = createItemBox(item, index, yPosition);
    });
  
    // Location & Officer Details
    yPosition = createBoxContainer(
      "Location & Officer Details",
      [
        { label: "In Location", value: request.inLocation || "N/A" },
        { label: "Out Location", value: request.outLocation || "N/A" },
        { label: "Executive Officer", value: request.executiveOfficer || "N/A" },
        { label: "Vehicle Number", value: request.vehicleNumber || "N/A" },
        { label: "By Hand", value: request.byHand || "No" }
      ],
      yPosition
    );
  
    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }
  
    // Save the PDF
    doc.save(`request_${request._id}.pdf`);
  };
  if (!request || !user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6 relative">
        {/* Back Arrow Button */}
        <button 
          onClick={() => navigate("/my-request")}
          className="absolute top-4 right-4 bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors"
          aria-label="Back to My Requests"
        >
          <FaArrowLeft className="text-lg" />
        </button>
        
        {/* Request Details Heading */}
        <div className="text-blue-700 font-bold text-lg text-center my-4">Request Details</div>
        
        {/* Reference Number as Title */}
        <div className="bg-[#2A6BAC] text-white text-center font-bold text-lg py-2 rounded-t-md">
          Ref. No: {request._id}
        </div>

        {/* Status Badge */}
        <div className={`text-center my-2 p-2 rounded-md font-bold ${
          request.status === 'Approved' ? 'bg-green-200 text-green-800' :
          request.status === 'Rejected' ? 'bg-red-200 text-red-800' :
          'bg-yellow-200 text-yellow-800'
        }`}>
          Status: {request.status}
        </div>

        {/* Sender Details Box */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
          <div className="text-blue-700 px-4 py-2 rounded-t-md font-bold">Sender Details</div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            <p className="text-lg font-medium">Name: <span className="font-normal">{user.username}</span></p>
            <p className="text-lg font-medium">Email: <span className="font-normal">{user.email}</span></p>
            <p className="text-lg font-medium">Contact: <span className="font-normal">{user.contact_number}</span></p>
          </div>
        </div>

        {/* Receiver Details Box */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
          <div className="text-green-700 px-4 py-2 rounded-t-md font-bold">Receiver Details</div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            <p className="text-lg font-medium">Name: <span className="font-normal">{request.receiverName}</span></p>
            <p className="text-lg font-medium">Contact No: <span className="font-normal">{request.receiverContact}</span></p>
            <p className="text-lg font-medium">Group: <span className="font-normal">{request.receiverGroup}</span></p>
            {request.receiverServiceNumber && (
              <p className="text-lg font-medium">Service No: <span className="font-normal">{request.receiverServiceNumber}</span></p>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
          <div className="text-blue-700 px-4 py-2 rounded-t-md font-bold">Items ({request.items.length})</div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            {request.items.map((item, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                <h4 className="font-bold text-lg mb-2">Item {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-lg font-medium">Name: <span className="font-normal">{item.itemName}</span></p>
                  <p className="text-lg font-medium">Serial No: <span className="font-normal">{item.serialNo || 'N/A'}</span></p>
                  <p className="text-lg font-medium">Category: <span className="font-normal">{item.category || 'N/A'}</span></p>
                  <p className="text-lg font-medium">Quantity: <span className="font-normal">{item.quantity || '1'}</span></p>
                  <p className="text-lg font-medium">Description: <span className="font-normal">{item.description || 'N/A'}</span></p>
                  <p className="text-lg font-medium">Returnable: <span className="font-normal">{item.returnable === 'yes' ? 'Yes' : 'No'}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Officer Details Box */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300 mb-4">
          <div className="text-blue-700 px-4 py-2 rounded-t-md font-bold">Location & Officer Details</div>
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            <p className="text-lg font-medium">In Location: <span className="font-normal">{request.inLocation || "N/A"}</span></p>
            <p className="text-lg font-medium">Out Location: <span className="font-normal">{request.outLocation || "N/A"}</span></p>
            <p className="text-lg font-medium">Executive Officer: <span className="font-normal">{request.executiveOfficer || "N/A"}</span></p>
            <p className="text-lg font-medium">Vehicle Number: <span className="font-normal">{request.vehicleNumber || "N/A"}</span></p>
            <p className="text-lg font-medium">By Hand: <span className="font-normal">{request.byHand || "No"}</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
            onClick={downloadPdf}
          >
            <FaFilePdf className="text-lg" />
            Download PDF
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button 
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow-md transition-colors" 
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRequest;
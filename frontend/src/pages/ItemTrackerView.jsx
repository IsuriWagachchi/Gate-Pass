import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import laptopImage from '../assets/laptop.jpg';
import { jsPDF } from "jspdf"; // Add this import

const ItemTrackerView = () => {
  const [request, setRequest] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setRequest(response.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  // Add this PDF download function
  const downloadPdf = () => {
    if (!request) return;
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const boxWidth = pageWidth - 2 * margin;
    const columnWidth = (boxWidth - 20) / 2;
    const textPadding = 6;
    const LABEL_VALUE_GAP = 0.5;
    let pageCount = 1;
  
    // Colors
    const colors = {
      primary: [42, 107, 172],
      success: [0, 128, 0],
      danger: [255, 0, 0],
      warning: [255, 165, 0],
      darkBlue: [27, 61, 129],
      darkGreen: [22, 163, 74],
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
      let contentHeight = textPadding;
      content.forEach(item => {
        const text = `${item.label}: ${item.value}`;
        contentHeight += Math.max(
          doc.splitTextToSize(text, boxWidth - textPadding * 2).length * 5.5,
          12
        );
      });
  
      const boxHeight = 15 + contentHeight + (textPadding / 2);
      
      if (yPos + boxHeight > pageHeight - margin - 10) {
        doc.addPage();
        pageCount++;
        yPos = margin;
        doc.setFontSize(18);
        doc.setTextColor(...colors.primary);
        doc.text("ITEM TRACKING DETAILS", pageWidth / 2, 20, { align: 'center' });
      }
  
      roundedRectWithBorder(margin, yPos, boxWidth, boxHeight, 3, colors.white);
      roundedRectWithBorder(margin, yPos, boxWidth, 12, 3, titleColor, titleColor);
      doc.setTextColor(...colors.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(title, margin + textPadding, yPos + 8);
      
      let currentY = yPos + 17;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      content.forEach((item, index) => {
        const fullText = `${item.label}: ${item.value}`;
        const lines = doc.splitTextToSize(fullText, boxWidth - textPadding * 2);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.label}:`, margin + textPadding, currentY);
        
        const labelWidth = doc.getTextWidth(`${item.label}: `) + LABEL_VALUE_GAP;
        
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(item.value, boxWidth - textPadding * 2 - labelWidth);
        
        doc.text(valueLines[0], margin + textPadding + labelWidth, currentY);
        
        let yOffset = 0;
        for (let i = 1; i < valueLines.length; i++) {
          yOffset += 5;
          doc.text(valueLines[i], margin + textPadding + labelWidth, currentY + yOffset);
        }
        
        currentY += Math.max(valueLines.length * 5.5, 12);
        
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
      const itemHeight = 80;
      
      if (yPos + itemHeight > pageHeight - margin - 10) {
        doc.addPage();
        pageCount++;
        yPos = margin;
        doc.setFontSize(18);
        doc.setTextColor(...colors.primary);
        doc.text("ITEM TRACKING DETAILS", pageWidth / 2, 20, { align: 'center' });
      }
  
      roundedRectWithBorder(margin, yPos, boxWidth, itemHeight, 3, colors.white);
      roundedRectWithBorder(margin, yPos, boxWidth, 12, 3, colors.darkBlue, colors.darkBlue);
      doc.setTextColor(...colors.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(itemTitle, margin + textPadding, yPos + 8);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(item.itemName, margin + textPadding, yPos + 20);
      
      const leftColumn = [
        { label: "Serial No", value: item.serialNo || 'N/A' },
        { label: "Category", value: item.category || 'N/A' },
        { label: "Returnable", value: item.returnable === 'yes' ? 'Yes' : 'No' }
      ];
      
      const rightColumn = [
        { label: "Quantity", value: item.quantity || '1' },
        { label: "Dispatch Out", value: request.dispatchStatusOut || 'N/A' },
        { label: "Dispatch In", value: request.dispatchStatusIn || 'N/A' }
      ];
      
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
      
      doc.setFont('helvetica', 'bold');
      doc.text("Description:", margin + 10, yPos + 60);
      
      doc.setFont('helvetica', 'normal');
      const descLabelWidth = doc.getTextWidth("Description:") + LABEL_VALUE_GAP;
      const descLines = doc.splitTextToSize(item.description || 'N/A', boxWidth - 20 - descLabelWidth);
      
      descLines.forEach((line, i) => {
        doc.text(line, margin + 10 + descLabelWidth, yPos + 60 + (i * 5));
      });
      
      return yPos + itemHeight + 10;
    };
  
    // Header
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);
    doc.text("ITEM TRACKING DETAILS", pageWidth / 2, 20, { align: 'center' });
  
    // Reference Number
    doc.setFontSize(14);
    doc.setTextColor(...colors.white);
    roundedRectWithBorder(margin, 30, boxWidth, 12, 3, colors.primary);
    doc.text(`Ref. No: ${request._id}`, pageWidth / 2, 37, { align: 'center' });
  
    // Date
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${new Date(request.createdAt).toLocaleDateString()}`, margin + doc.getTextWidth("Date: ") + LABEL_VALUE_GAP, 55);
  
    let yPosition = 65;
  
    // Location Details
    yPosition = createBoxContainer(
      "Location Details",
      [
        { label: "Out Location", value: request.outLocation || "N/A" },
        { label: "In Location", value: request.inLocation || "N/A" },
        { label: "Vehicle Number", value: request.vehicleNumber || "N/A" },
        { label: "By Hand", value: request.byHand || "No" }
      ],
      yPosition,
      colors.darkGreen
    );
  
    // Receiver Details
    yPosition = createBoxContainer(
      "Receiver Details",
      [
        { label: "Name", value: request.receiverName || "N/A" },
        { label: "Contact", value: request.receiverContact || "N/A" },
        { label: "Group", value: request.receiverGroup || "N/A" }
      ],
      yPosition
    );
  
    // Individual Items
    request.items.forEach((item, index) => {
      yPosition = createItemBox(item, index, yPosition);
    });
  
    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }
  
    // Save the PDF
    doc.save(`item_tracking_${request._id}.pdf`);
  };

  if (!request) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
        {/* Header - Only change is adding the PDF button */}
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>Item Tracking Details</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadPdf}
              className="bg-[#2A6BAC] text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="text-blue-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* The rest of your component remains EXACTLY the same */}
        {/* Request Overview */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Out Location:</p>
              <p>{request.outLocation}</p>
            </div>
            <div>
              <p className="font-medium">In Location:</p>
              <p>{request.inLocation}</p>
            </div>
            <div>
              <p className="font-medium">Dispatch Out Status:</p>
              <p className={`inline-block px-2 rounded ${
                request.dispatchStatusOut === "Approved" ? "bg-green-100 text-green-800" :
                request.dispatchStatusOut === "Rejected" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {request.dispatchStatusOut}
              </p>
            </div>
            <div>
              <p className="font-medium">Dispatch In Status:</p>
              <p className={`inline-block px-2 rounded ${
                request.dispatchStatusIn === "Approved" ? "bg-green-100 text-green-800" :
                request.dispatchStatusIn === "Rejected" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {request.dispatchStatusIn}
              </p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Items ({request.items.length})</h3>
          
          {request.items.map((item, index) => (
            <div key={index} className="p-4 rounded-lg shadow-md border border-gray-300">
              {/* Item Header */}
              <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md flex justify-between font-bold">
                <span>Item #{index + 1}</span>
                <span>Ref: {item.serialNo}</span>
              </div>

              {/* Item Details */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div>
                  <div className="mb-3">
                    <p className="font-medium">Name:</p>
                    <p>{item.itemName}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Category:</p>
                    <p>{item.category}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Quantity:</p>
                    <p>{item.quantity}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="mb-3">
                    <p className="font-medium">Description:</p>
                    <p>{item.description}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Returnable:</p>
                    <p>{item.returnable}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Image:</p>
                    <div className="flex items-center mt-2">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.itemName} 
                          className="w-16 h-16 object-cover border rounded"
                        />
                      ) : (
                        <img 
                          src={laptopImage} 
                          alt="Default item" 
                          className="w-16 h-16 object-cover border rounded"
                        />
                      )}
                      <button 
                        className="ml-2 bg-[#2A6BAC] text-white px-3 py-1 rounded text-sm"
                        onClick={() => {
                          if (item.image) window.open(item.image, '_blank');
                        }}
                      >
                        {item.image ? "View Full" : "No Image"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Request Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Receiver Name:</p>
              <p>{request.receiverName}</p>
            </div>
            <div>
              <p className="font-medium">Receiver Contact:</p>
              <p>{request.receiverContact}</p>
            </div>
            <div>
              <p className="font-medium">Transport Method:</p>
              <p>{request.byHand ? "By Hand" : request.vehicleNumber ? `Vehicle: ${request.vehicleNumber}` : "Not specified"}</p>
            </div>
            <div>
              <p className="font-medium">Created At:</p>
              <p>{new Date(request.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemTrackerView;
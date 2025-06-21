import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import laptopImage from "../assets/laptop.jpg";
import companylogo from "../assets/companylogo.png";
import { jsPDF } from "jspdf";

const DispatchViewIn = () => {
  const [request, setRequest] = useState(null);
  const { id } = useParams();
  const [dispatchStatusIn, setStatusDispatchIn] = useState("");
  const [approverNameIn, setapproverNameIn] = useState("");
  const [serviceNoIn, setserviceNoIn] = useState("");
  const [commentIn, setcommentIn] = useState("");
  const [employeeTypeIn, setemployeeTypeIn] = useState("SLT");
  const [nonSltNameIn, setNonSltNameIn] = useState("");
  const [nicNumberIn, setNicNumberIn] = useState("");
  const [companyNameIn, setCompanyNameIn] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/dispatch/getDispatchById/${id}`
      );
      setRequest(response.data);
      setStatusDispatchIn(response.data.dispatchStatusIn || "Pending");
      setError(null);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setError(error.response?.data?.message || "Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!request) return;

    const doc = new jsPDF();
    
    // Add logo to the PDF
    try {
      // Convert logo image to base64
      const response = await fetch(companylogo);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = function() {
        const logoDataUrl = reader.result;
        
        // Set font styles
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        // Add logo (width: 50, height: auto maintains aspect ratio)
        doc.addImage(logoDataUrl, 'PNG', 80, 10, 50, 20);

        // Add title below logo
        doc.setFontSize(18);
        doc.text("DISPATCH IN DETAILS", 105, 40, { align: "center" });

        // Add reference number
        doc.setFontSize(14);
        doc.text(`Reference: ${request._id}`, 105, 50, { align: "center" });

        // Add request information section
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Request Information", 14, 65);
        doc.setFont("helvetica", "normal");
        
        // Request information details
        doc.text(`Status: ${request.dispatchStatusIn || "Pending"}`, 14, 75);
        doc.text(`Requested by: ${request.sender_name || "N/A"}`, 14, 85);
        doc.text(`Service No: ${request.service_no || "N/A"}`, 105, 85);
        doc.text(`Designation: ${request.designation || "N/A"}`, 14, 95);
        doc.text(`Contact: ${request.contact_number || "N/A"}`, 105, 95);
        doc.text(`Out Location: ${request.outLocation || "N/A"}`, 14, 105);
        doc.text(`In Location: ${request.inLocation || "N/A"}`, 105, 105);
        doc.text(`By Hand: ${request.byHand || "No"}`, 14, 115);
        doc.text(`Vehicle No: ${request.vehicleNumber || "N/A"}`, 105, 115);
        doc.text(`Approved By: ${request.executiveOfficer || "N/A"}`, 14, 125);

        // Add dispatch approval details if available
        if (request.dispatchStatusIn && request.dispatchStatusIn !== "Pending") {
          doc.setFont("helvetica", "bold");
          doc.text("Dispatch Approval Details", 14, 140);
          doc.setFont("helvetica", "normal");
          
          doc.text(`Status: ${request.dispatchStatusIn}`, 14, 150);
          doc.text(`Processed By: ${request.approverNameIn || request.nonSltNameIn || "N/A"}`, 14, 160);
          doc.text(`Employee Type: ${request.employeeTypeIn || "N/A"}`, 105, 160);
          
          if (request.employeeTypeIn === "SLT") {
            doc.text(`Service No: ${request.serviceNoIn || "N/A"}`, 14, 170);
          } else if (request.employeeTypeIn === "Non-SLT") {
            doc.text(`NIC No: ${request.nicNumberIn || "N/A"}`, 14, 170);
            doc.text(`Company: ${request.companyNameIn || "N/A"}`, 105, 170);
          }
          
          doc.text(`Comment: ${request.commentIn || "N/A"}`, 14, 180);
        } else {
          // Add blank fields for manual filling if status is pending
          doc.setFont("helvetica", "bold");
          doc.text("Dispatch Approval Details (To Be Filled)", 14, 140);
          doc.setFont("helvetica", "normal");
          
          doc.text("Status: _______________", 14, 150);
          doc.text("Processed By: _______________", 14, 160);
          doc.text("Employee Type: _______________", 105, 160);
          doc.text("Service No/NIC No: _______________", 14, 170);
          doc.text("Comment: _______________", 14, 180);
        }

        // Add items section
        doc.setFont("helvetica", "bold");
        doc.text(`Items (${request.items?.length || 0})`, 14, 195);
        doc.setFont("helvetica", "normal");

        let yPosition = 205;
        
        // Add each item
        request.items?.forEach((item, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          // Item header
          doc.setFont("helvetica", "bold");
          doc.text(`Item #${index + 1}`, 14, yPosition);
          doc.text(`Ref: ${item.serialNo || "N/A"}`, 180, yPosition, { align: "right" });
          yPosition += 5;

          // Item details
          doc.setFont("helvetica", "normal");
          doc.text(`Name: ${item.itemName || "N/A"}`, 14, yPosition);
          doc.text(`Category: ${item.category || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Quantity: ${item.quantity || "N/A"}`, 14, yPosition);
          doc.text(`Returnable: ${item.returnable || "N/A"}`, 105, yPosition);
          yPosition += 7;

          doc.text(`Description: ${item.description || "N/A"}`, 14, yPosition);
          yPosition += 10;
        });

        // Add receiver details section
        doc.setFont("helvetica", "bold");
        doc.text("Receiver Details", 14, yPosition);
        yPosition += 7;
        
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${request.receiverName || "N/A"}`, 14, yPosition);
        doc.text(`Contact: ${request.receiverContact || "N/A"}`, 105, yPosition);
        yPosition += 7;

        doc.text(`Service No: ${request.receiverServiceNumber || "N/A"}`, 14, yPosition);
        doc.text(`Group: ${request.receiverGroup || "N/A"}`, 105, yPosition);
        yPosition += 7;

        // Add creation date
        doc.text(`Created At: ${request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}`, 14, yPosition);

        // Save the PDF
        doc.save(`dispatch-in-details-${id}.pdf`);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback PDF without logo if there's an error
      generatePdfWithoutLogo(doc);
    }
  };

  // Fallback PDF generation without logo
  const generatePdfWithoutLogo = (doc) => {
    // Set font styles
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Add title
    doc.setFontSize(18);
    doc.text("DISPATCH IN DETAILS", 105, 15, { align: "center" });

    // Add reference number
    doc.setFontSize(14);
    doc.text(`Reference: ${request._id}`, 105, 25, { align: "center" });

    // Save the PDF
    doc.save(`dispatch-in-details-${id}.pdf`);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === "Rejected" && !commentIn.trim()) {
      alert("Comment is required for rejection!");
      return;
    }

    try {
      const payload = {
        dispatchStatusIn: newStatus,
        employeeTypeIn,
        commentIn,
      };
    
      if (employeeTypeIn === "SLT") {
        payload.approverNameIn = approverNameIn;
        payload.serviceNoIn = serviceNoIn;
        if (!approverNameIn.trim() || !serviceNoIn.trim()) {
          alert("Name and Service Number are required!");
          return;
        }
      } else if (employeeTypeIn === "Non-SLT") {
        payload.nonSltNameIn = nonSltNameIn;
        payload.nicNumberIn = nicNumberIn;
        payload.companyNameIn = companyNameIn;
        if (!nonSltNameIn.trim() || !nicNumberIn.trim() || !companyNameIn.trim()) {
          alert("Name, NIC Number and Company name are required!");
          return;
        }
      }
    
      // Send PUT request
      await axios.put(`http://localhost:5000/api/dispatch/updateApprovalIn/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      setStatusDispatchIn(newStatus);
      alert(`Request ${newStatus} successfully!`);
      fetchRequestDetails();
    } catch (error) {
      console.error(`Error updating status:`, error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
          <p className="text-center">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
          <p className="text-red-500 text-center">{error}</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-blue-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto p-6 font-sans flex justify-center">
        <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
          <p className="text-center">No request data found.</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-blue-500 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>
            Dispatch In Location Details ➝{" "}
            <span
              className={`${
                dispatchStatusIn === "Approved"
                  ? "text-green-600"
                  : dispatchStatusIn === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {dispatchStatusIn}
            </span>
          </h2>
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

        {/* Request Details Section */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300">
          {/* Blue Header */}
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md flex justify-between font-bold">
            <span>Dispatch Details</span>
            <span>Ref. No: {request._id}</span>
          </div>

          {/* Item Details Box */}
          <div className="p-3 bg-white rounded-b-md border border-gray-300">
            <div className="lg:flex flex-col lg:flex-row justify-between items-start space-y-6 lg:space-y-0 lg:space-x-6">
              {/* Left Section */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3 mt-4">
                  Sender Details
                </h4>
                <p className="text-lg font-medium mb-1">
                  Name:{" "}
                  <span className="font-normal">{request.sender_name}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Designation:{" "}
                  <span className="font-normal">{request.designation}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Service Number:{" "}
                  <span className="font-normal">{request.service_no}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Contact Number:{" "}
                  <span className="font-normal">{request.contact_number}</span>
                </p>

                <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 my-4 mt-8">
                  Request Details
                </h4>
                <p className="text-lg font-medium mb-1">
                  Out Location:{" "}
                  <span className="font-normal">{request.outLocation}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  In Location:{" "}
                  <span className="font-normal">{request.inLocation}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Approved By:{" "}
                  <span className="font-normal">
                    {request.executiveOfficer}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  By Hand:{" "}
                  <span className="font-normal">{request.byHand || "No"}</span>
                </p>
                {request.vehicleNumber && (
                  <p className="text-lg font-medium mb-1">
                    Vehicle Number:{" "}
                    <span className="font-normal">{request.vehicleNumber}</span>
                  </p>
                )}
                <br />
                {request.dispatchStatusOut !== "Pending" && (
                  <>
                    <p className="text-lg font-medium mb-1">
                      Dispatch Out Location Status:{" "}
                      <span
                        className={`px-3 py-2 rounded ${
                          request.dispatchStatusOut === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {request.dispatchStatusOut}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Employee Type:{" "}
                      <span className="font-normal">
                        {request.employeeTypeOut}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Processed By:{" "}
                      <span className="font-normal">
                        {request.approverNameOut || request.nonSltNameOut}
                      </span>
                    </p>
                    {request.employeeTypeOut === "SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          Service No:{" "}
                          <span className="font-normal">{request.serviceNoOut}</span>
                        </p>
                      </>
                    )}
                    {request.employeeTypeOut === "Non-SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          NIC Number:{" "}
                          <span className="font-normal">{request.nicNumberOut}</span>
                        </p>
                      </>
                    )}
                    {request.commentOut && (
                      <p className="text-lg font-medium mb-1">
                        Comment:{" "}
                        <span className="font-normal">
                          {request.commentOut || "N/A"}
                        </span>
                      </p>
                    )}
                  </>
                )}
                <br />
                {request.dispatchStatusIn !== "Pending" && (
                  <>
                    <p className="text-lg font-medium mb-1">
                      Dispatch In Location Status:{" "}
                      <span
                        className={`px-3 py-2 rounded ${
                          request.dispatchStatusIn === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {request.dispatchStatusIn}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Employee Type:{" "}
                      <span className="font-normal">
                        {request.employeeTypeIn}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Processed By:{" "}
                      <span className="font-normal">
                        {request.approverNameIn || request.nonSltNameIn}
                      </span>
                    </p>
                    {request.employeeTypeIn === "SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          Service No:{" "}
                          <span className="font-normal">{request.serviceNoIn}</span>
                        </p>
                      </>
                    )}
                    {request.employeeTypeIn === "Non-SLT" && (
                      <>
                        <p className="text-lg font-medium mb-1">
                          NIC Number:{" "}
                          <span className="font-normal">{request.nicNumberIn}</span>
                        </p>
                        <p className="text-lg font-medium mb-1">
                          Company Name:{" "}
                          <span className="font-normal">{request.companyNameIn}</span>
                        </p>
                      </>
                    )}
                    
                    {request.commentIn && (
                      <p className="text-lg font-medium mb-1">
                        Comment:{" "}
                        <span className="font-normal">
                          {request.commentIn || "N/A"}
                        </span>
                      </p>
                    )}
                  </>
                )}

                <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mt-8 mb-3">
                  Receiver Details
                </h4>
                <p className="text-lg font-medium mb-1">
                  Name:{" "}
                  <span className="font-normal">
                    {request.receiverName
                      ? request.receiverName[0].toUpperCase() +
                        request.receiverName.slice(1)
                      : "N/A"}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Contact Number:{" "}
                  <span className="font-normal">
                    {request.receiverContact || "N/A"}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Service Number:{" "}
                  <span className="font-normal">
                    {request.receiverServiceNumber || "N/A"}
                  </span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Receiver Group:{" "}
                  <span className="font-normal">
                    {request.receiverGroup || "N/A"}
                  </span>
                </p>
              </div>

              {/* Right Section - Items */}
              <div className="flex-1">
                {request.items && request.items.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3 mt-4">
                      Item Details
                    </h4>
                    <div className="space-y-3">
                      {request.items.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <p>
                            <span className="text-lg font-medium">Name:</span> {item.itemName}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Serial No:</span> {item.serialNo}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Category:</span> {item.category}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Quantity:</span> {item.quantity}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Returnable:</span> {item.returnable}
                          </p>
                          <p>
                            <span className="text-lg font-medium">Description:</span>{" "}
                            {item.description || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image and View Button Section */}
                <div className="flex justify-start mt-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={laptopImage}
                      alt="Item"
                      className="w-24 h-24 object-cover border rounded-lg shadow-md"
                    />
                    <button className="bg-[#2A6BAC] text-white px-4 py-1 mt-2 rounded-lg shadow-md">
                      View Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Section */}
          {dispatchStatusIn === "Pending" && (
            <>
              {/* Employee Type Selection (Radio Buttons) */}
              <label className="block font-bold mb-2 text-blue-700 mt-5">
                Employee Type
              </label>
              <div className="flex gap-6 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeType"
                    value="SLT"
                    checked={employeeTypeIn === "SLT"}
                    onChange={() => setemployeeTypeIn("SLT")}
                    className="mr-2"
                  />
                  SLT Employee
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeType"
                    value="Non-SLT"
                    checked={employeeTypeIn === "Non-SLT"}
                    onChange={() => setemployeeTypeIn("Non-SLT")}
                    className="mr-2"
                  />
                  Non-SLT Employee
                </label>
              </div>

              {/* SLT Employee Section */}
              {employeeTypeIn === "SLT" && (
                <>
                  <label className="block font-bold mb-2 text-blue-700">
                    Processed By
                  </label>
                  <input
                    type="text"
                    value={approverNameIn}
                    onChange={(e) => setapproverNameIn(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter Name"
                    required
                  />

                  <label className="block font-bold mb-2 text-blue-700 mt-3">
                    Service Number
                  </label>
                  <input
                    type="text"
                    value={serviceNoIn}
                    onChange={(e) => setserviceNoIn(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter Service Number"
                    required
                  />
                </>
              )}

              {/* Non-SLT Employee Section */}
              {employeeTypeIn === "Non-SLT" && (
                <>
                  <label className="block font-bold mb-2 text-blue-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={nonSltNameIn}
                    onChange={(e) => setNonSltNameIn(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter Full Name"
                    required
                  />

                  <label className="block font-bold mb-2 text-blue-700 mt-3">
                    NIC Number
                  </label>
                  <input
                    type="text"
                    value={nicNumberIn}
                    onChange={(e) => setNicNumberIn(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter NIC Number"
                    required
                  />

                  <label className="block font-bold mb-2 text-blue-700 mt-3">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyNameIn}
                    onChange={(e) => setCompanyNameIn(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    placeholder="Enter Company Name"
                    required
                  />
                </>
              )}

              {/* Comment (Required for Rejection) */}
              <label className="block font-bold mb-2 text-blue-700 mt-3">
                Comment
              </label>
              <textarea
                value={commentIn}
                onChange={(e) => setcommentIn(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter Comment Here"
              ></textarea>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                <div className="flex space-x-2">
                  <button
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md"
                    onClick={() => handleUpdateStatus("Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-700 text-white px-8 py-2 rounded-lg shadow-md"
                    onClick={() => handleUpdateStatus("Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchViewIn;